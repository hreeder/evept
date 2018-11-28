import Character from './character'

const DAY = 24*60*60
const now = new Date()
const two_weeks_ago = new Date(now.getTime() - 2*7*DAY)
const two_days_ago = new Date(now.getTime() - 2*DAY)
const yesterday = new Date(now.getTime() - DAY)
const tomorrow = new Date(now.getTime() + DAY)
const two_days_time = new Date(now.getTime() + 2*DAY)
const two_weeks_time = new Date(now.getTime() + 2*7*DAY)

describe('the character model', () => {
  it('returns a list of items in the skill queue', () => {
    const char = new Character()
    expect(char.getSkillQueue()).toEqual([])
  })
  
  it('returns a list of items representing trained skills', () => {
    const char = new Character()
    expect(char.getSkills()).toEqual([])
  })
  
  it('returns short form skillpoints correctly', () => {
    const char = new Character()
    char.total_sp = 5000000 // 5 million
    expect(char.totalSpShortForm()).toEqual('5M SP')
    
    char.total_sp = 5100000 // 5.1 million
    expect(char.totalSpShortForm()).toEqual('5.1M SP')
    
    char.total_sp = 512000 // 512 thousand
    expect(char.totalSpShortForm()).toEqual('512k SP')
  })
  
  it('returns undefined for no skill in training', () => {
    const char = new Character()
    expect(char.getCurrentlyTrainingSkill()).toEqual(undefined)
  })
  
  it("detects omega status as undefined before we've loaded skills", () => {
    const char = new Character()
    expect(char.isOmega()).toEqual(undefined)
  })
  
  it("adds roman numerals to skills with getSkills", () => {
    const char = new Character()
    char.skills = [{ trained_skill_level: 1 }]
    
    expect(char.getSkills()[0]).toHaveProperty('level', "I")
  })
  
  it('detects & enriches currently training skill', () => {
    const char = new Character()
    char.skillqueue = [{
      skill_id: 1,
      start_date: yesterday.toISOString(),
      finish_date: tomorrow.toISOString(),
      finished_level: 5
    }, {
      skill_id: 2,
      start_date: tomorrow.toISOString(),
      finish_date: two_days_time.toISOString(),
      finished_level: 5
    }]
    
    const currently_training = char.getCurrentlyTrainingSkill()
    
    // test we get the right entry
    expect(currently_training.skill_id).toEqual(1)
    expect(currently_training.start_date).toEqual(yesterday.toISOString())
    expect(currently_training.finish_date).toEqual(tomorrow.toISOString())
    expect(currently_training.finished_level).toEqual(5)
    
    // test we enrich it properly
    expect(currently_training.level).toEqual("V")
    expect(currently_training.started_at).toEqual(yesterday.getTime())
    expect(currently_training.finishes_at).toEqual(tomorrow.getTime())
    expect(currently_training.remaining_days).toEqual(1)
    expect(currently_training.progress).toEqual(50)
  })
  
  it('detects omega status by character training & being over 5m sp', () => {
    const omega = new Character().fromJSON({
      total_sp: 5000001,
      skillqueue: [{
        start_date: yesterday.toISOString(),
        finish_date: tomorrow.toISOString(),
        finished_level: 5
      }]
    })
    expect(omega.isOmega()).toEqual(true)
  })
  
  it('detects alpha status by character having a skill with higher trained level than active level', () => {
    const alpha = new Character()
    alpha.skills = [{
      trained_skill_level: 5,
      active_skill_level: 3
    }]
    
    expect(alpha.isOmega()).toEqual(false)
  })
  
  it('detects omega status by the queue having items starting more than 24h in the future', () => {
    const omega = new Character()
    omega.skillqueue = [{
      start_date: yesterday.toISOString(),
      finish_date: two_days_time.toISOString(),
      finished_level: 5
    }, {
      start_date: two_days_time.toISOString(),
      finish_date: two_weeks_time.toISOString(),
      finished_level: 5
    }]
    
    expect(omega.isOmega()).toEqual(true)
  })

  it('does not return old entries in the skill queue', () => {
    const char = new Character()
    char.skillqueue = [
      {
        finished_level: 5,
        start_date: two_weeks_ago.toISOString(),
        finish_date: two_days_ago.toISOString()
      },
      {
        finished_level: 5,
        start_date: two_days_ago.toISOString(),
        finish_date: yesterday.toISOString()
      },
      {
        finished_level: 5,
        start_date: yesterday.toISOString(),
        finish_date: tomorrow.toISOString()
      }
    ]

    expect(char.getSkillQueue()).toHaveLength(1)
  })

  it('sorts the skill queue by the queue_position attribute', () => {
    const char = new Character()
    char.skillqueue = [
      {
        finished_level: 5,
        start_date: two_days_time.toISOString(),
        finish_date: two_weeks_time.toISOString(),
        queue_position: 3
      },
      {
        finished_level: 5,
        start_date: yesterday.toISOString(),
        finish_date: tomorrow.toISOString(),
        queue_position: 1
      },
      {
        finished_level: 5,
        start_date: tomorrow.toISOString(),
        finish_date: two_days_time.toISOString(),
        queue_position: 2
      }
    ]

    expect(char.getSkillQueue()[0]).toHaveProperty('queue_position', 1)
    expect(char.getSkillQueue()[1]).toHaveProperty('queue_position', 2)
    expect(char.getSkillQueue()[2]).toHaveProperty('queue_position', 3)
  })
})