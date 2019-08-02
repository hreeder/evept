import { getRomanNumeral } from '../util/romanNumerals'

class Character {
  skillsLoaded = false
  skillqueueLoaded = false

  fromJSON(json) {
    Object.keys(json).forEach(key => this[key] = json[key])
    if (this.hasOwnProperty("last_updated")) {
      this.updated_at = this.last_updated.Time
    }

    if (this.hasOwnProperty("corporationId")) {
      this.corporationId = this.corporationId.Int64
    }

    if (this.hasOwnProperty('securityStatus')) {
      this.securityStatus = this.securityStatus.Float64
    }

    if (this.hasOwnProperty('totalSkillpoints')) {
      this.total_sp = this.totalSkillpoints.Int64
    }

    if (this.hasOwnProperty('unallocatedSkillpoints')) {
      this.unallocated_sp = this.unallocatedSkillpoints.Int64
    }

    return this
  }

  getSkills() {
    let _skills = []
    
    // if we don't have skills to process, abort
    if (!this.hasOwnProperty('skills')) return _skills
    
    this.skills.forEach(skill => {
      skill['level'] = getRomanNumeral(skill['trained_skill_level'])
      _skills.push(skill)
    })

    return _skills
  }

  getSkillQueue() {
    const now = Date.now()
    let _skillqueue = []
    
    // if we don't have a skillqueue to process, abort
    if (!this.hasOwnProperty('skillqueue')) return _skillqueue

    _skillqueue = this.skillqueue.filter(skill => Date.parse(skill.finish_date) > now)
    _skillqueue.sort((a, b) => a.queue_position - b.queue_position)

    return _skillqueue
  }

  walletAmountShortForm() {
    // TODO: Add wallet support
    return ''
  }

  totalSpShortForm() {
    if (!this.hasOwnProperty('total_sp')) return ''

    let sp_value = this.total_sp / 1.0e+6
    let suffix = "M"
    let dp = 1

    if (this.total_sp < 1.0e+6) {
      sp_value = this.total_sp / 1.0e+3
      suffix = "k"
      dp = 0
    }

    // we use parseFloat to remove .0 where not necessary
    return `${parseFloat(sp_value.toFixed(dp))}${suffix} SP`
  }

  getCurrentlyTrainingSkill() {
    const now = Date.now()
    let currently_training = undefined

    if (!this.hasOwnProperty('skillqueue')) return currently_training
    
    this.skillqueue.forEach(skill => {
      skill['started_at'] = Date.parse(skill.start_date)
      skill['finishes_at'] = Date.parse(skill.finish_date)
      skill['remaining_days'] = Math.ceil((skill.finishes_at - now) / (1000*60*60*24))
      skill['level'] = getRomanNumeral(skill['finished_level'])
      if (skill['started_at'] < now && now < skill['finishes_at']) {
        currently_training = skill
      }
    })

    if (currently_training !== undefined) {
      currently_training['progress'] = Math.round((Math.abs(now - currently_training['started_at'])/Math.abs(currently_training['finishes_at'] - currently_training['started_at'])) * 100)
    }

    return currently_training
  }

  // This function is borrowed from / inspired by the one found in Cerebral
  isOmega() {
    // If we're training and we're over 5m SP, we're omega
    if ((this.total_sp > 5000000) && (this.getCurrentlyTrainingSkill() !== undefined)) return true

    // If we've got skills with a higher trained level than what's active, we're alpha
    if (this.getSkills().find(skill => skill.trained_skill_level > skill.active_skill_level) !== undefined) return false

    // If the queue has items starting more than 24h in the future, they're omega
    const dayFromNow = Date.now() + 24*60*60
    const skillsTrainingInFuture = this.getSkillQueue().find(skill => Date.parse(skill.start_date)  > dayFromNow && skill.hasOwnProperty('finish_date'))
    if (skillsTrainingInFuture !== undefined) return true

    // We don't know
    return undefined
  }
}

export default Character