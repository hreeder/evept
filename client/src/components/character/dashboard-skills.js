import React, { Component } from 'react'

import { UncontrolledTooltip } from 'reactstrap'

class SkillHighlight extends Component {
  getColour(skill_level) {
    switch (skill_level) {
      case 5: {
        return "success"
      }
      case 4: {
        return "warning"
      }
      case 3:
      case 2:
      case 1:
      case 0: {
        return "danger"
      }
      default: {
        return "dark"
      }
    }
  }

  getLevel(typeID, showName=false, level="X") {
    if (!this.props.character.hasOwnProperty('skills')) return ""
    if (this.props.character.skills.length === 0) return ""
    if (!this.props.typeIDs.hasOwnProperty(typeID)) return ""
    
    const found_skill = this.props.character.skills.filter(s => s.skill_id === typeID)
    const skill_name = this.props.typeIDs[typeID].name
    
    if (found_skill.length === 1) {
      level = found_skill[0].trained_skill_level
    }

    const colour = this.getColour(level)

    if (showName) {
      return <span className={`skill-badge badge badge-${colour}`}>{skill_name}: {level}</span>
    } else {
      return (
        <div>
          <span id={`tooltips-${typeID}`} className={`skill-badge badge badge-${colour}`}>{level}</span>
          <UncontrolledTooltip placement="top" target={`tooltips-${typeID}`}>
            {skill_name}
          </UncontrolledTooltip>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        {/* Magic 14 */}
        <div className="row">
          <div className="col-md-12">
            <h4>The 'Magic' 14 <small><a href="https://wiki.eveuniversity.org/The_Magic_14">info</a></small></h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {/* Engineering */}
            {this.getLevel(3426, true, "Missing")} {/* CPU Management */}
            {this.getLevel(3413, true, "Missing")} {/* Power Grid Management */}
            {this.getLevel(3418, true, "Missing")} {/* Capacitor Management */}
            {this.getLevel(3417, true, "Missing")} {/* Capacitor Systems Operation */}

            {/* Armor */}
            {this.getLevel(3392, true, "Missing")} {/* Mechanics */}
            {this.getLevel(3394, true, "Missing")} {/* Hull Upgrades */}

            {/* Shields */}
            {this.getLevel(3419, true, "Missing")} {/* Shield Management */}
            {this.getLevel(3416, true, "Missing")} {/* Shield Operation */}

            {/* Targeting */}
            {this.getLevel(3428, true, "Missing")} {/* Long Range Targeting */}
            {this.getLevel(3431, true, "Missing")} {/* Signature Analysis */}

            {/* Navigation */}
            {this.getLevel(3449, true, "Missing")} {/* Navigation */}
            {this.getLevel(3453, true, "Missing")} {/* Evasive Maneuvering */}
            {this.getLevel(3455, true, "Missing")} {/* Warp Drive Operation */}

            {this.getLevel(3327, true, "Missing")} {/* Spaceship Command */}
          </div>
        </div>
        <hr />

        {/* Weapons Skills Rows */}
        <div className="row">
          <div className="col-md-12">
            <h4>Weapons Skills</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">S</th>
                  <th scope="col">M</th>
                  <th scope="col">L</th>
                  <th scope="col">XL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Lasers</th>
                  <td>{this.getLevel(3303)}</td>
                  <td>{this.getLevel(3306)}</td>
                  <td>{this.getLevel(3309)}</td>
                  <td>{this.getLevel(20327)}</td>
                </tr>
                <tr>
                  <th scope="row">Hybrids</th>
                  <td>{this.getLevel(3301)}</td>
                  <td>{this.getLevel(3304)}</td>
                  <td>{this.getLevel(3307)}</td>
                  <td>{this.getLevel(21666)}</td>
                </tr>
                <tr>
                  <th scope="row">Projectiles</th>
                  <td>{this.getLevel(3302)}</td>
                  <td>{this.getLevel(3305)}</td>
                  <td>{this.getLevel(3308)}</td>
                  <td>{this.getLevel(21667)}</td>
                </tr>
                <tr>
                  <th scope="row">Short Range Missiles</th>
                  <td>{this.getLevel(3320)}</td>{/* Rockets */}
                  <td>{this.getLevel(25719)}</td>{/* HAM */}
                  <td>{this.getLevel(3325)}</td>{/* Torps */}
                  <td>{this.getLevel(21668)}</td>{/* XL Torps */}
                </tr>
                <tr>
                  <th scope="row">Long Range Missiles</th>
                  <td>{this.getLevel(3321)}</td>{/* Missiles */}
                  <td>{this.getLevel(3324)}</td>{/* Heavy Missiles */}
                  <td>{this.getLevel(3326)}</td>{/* Cruise Missiles */}
                  <td>{this.getLevel(32435)}</td>{/* XL Cruise Missiles */}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col-md-6">
            <h6>Supports</h6>
            <div className="row">
              <table className="table">
                <tbody>
                  <tr>
                    <th scope="row">Turrets</th>
                    <td>{this.getLevel(3300)}</td>{/* Gunnery */}
                    <td>{this.getLevel(3310)}</td>{/* Rapid Firing */}
                    <td>{this.getLevel(3311)}</td>{/* Sharpshooter */}
                    <td>{this.getLevel(3312)}</td>{/* Motion Prediction */}
                    <td>{this.getLevel(3315)}</td>{/* Surgical Strike */}
                    <td>{this.getLevel(3316)}</td>{/* Controlled Bursts */}
                    <td>{this.getLevel(3317)}</td>{/* Trajectory Analysis */}
                  </tr>
                  <tr>
                    <th scope="row">Missiles</th>
                    <td>{this.getLevel(3319)}</td>{/* Missile Launcher Operation */}
                    <td>{this.getLevel(12441)}</td>{/* Missile Bombardment */}
                    <td>{this.getLevel(12442)}</td>{/* Missile Projection */}
                    <td>{this.getLevel(20312)}</td>{/* Guided Missile Precision */}
                    <td>{this.getLevel(20314)}</td>{/* Target Navigation Prediction */}
                    <td>{this.getLevel(20315)}</td>{/* Warhead Upgrades */}
                    <td>{this.getLevel(21071)}</td>{/* Rapid Launch */}
                  </tr>
                  <tr>
                    <th scope="row">Drones</th>
                    <td>{this.getLevel(3436)}</td>{/* Drones */}
                    <td>{this.getLevel(3437)}</td>{/* Drone Avionics */}
                    <td>{this.getLevel(23566)}</td>{/* Advanced Drone Avionics */}
                    <td>{this.getLevel(23618)}</td>{/* Drone Durability */}
                    <td>{this.getLevel(3442)}</td>{/* Drone Interfacing */}
                    <td>{this.getLevel(12305)}</td>{/* Drone Navigation */}
                    <td>{this.getLevel(23606)}</td>{/* Drone Sharpshooting */}
                  </tr>
                </tbody>
              </table>
            </div>
            <h6>Racial Drone Specs</h6>
            <div className="row">
              {this.getLevel(12484, true, "Missing")} {/* Amarr Drone Spec */}
              {this.getLevel(12485, true, "Missing")} {/* Minmatar Drone Spec */}
              {this.getLevel(12486, true, "Missing")} {/* Gallente Drone Spec */}
              {this.getLevel(12487, true, "Missing")} {/* Caldari Drone Spec */}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <h6>Drones</h6>
            <div className="row">
              {this.getLevel(24241, true, "Missing")} {/* Light Drone Operation */}
              {this.getLevel(33699, true, "Missing")} {/* Medium Drone Operation */}
              {this.getLevel(3441, true, "Missing")} {/* Heavy Drone Operation */}
              {this.getLevel(23594, true, "Missing")} {/* Sentry Drone Interfacing */}
            </div>
          </div>
          <div className="col-md-6">
            <h6>Fighters</h6>
            <div className="row">
              {this.getLevel(23069, true, "Missing")} {/* Fighters */}
              {this.getLevel(40572, true, "Missing")} {/* Light Fighters */}
              {this.getLevel(32339, true, "Missing")} {/* Heavy Fighters */}
              {this.getLevel(40573, true, "Missing")} {/* Support Fighters */}
              {this.getLevel(24613, true, "Missing")} {/* Fighter Hangar Management */}
            </div>
          </div>
        </div>
        <hr />

        {/* Ship Skills */}
        <div className="row">
          <div className="col-md-12">
            <h4>Ship Skills</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Am</th>
                  <th scope="col">Cal</th>
                  <th scope="col">Gal</th>
                  <th scope="col">Min</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Frigate</th>
                  <td>{this.getLevel(3331)}</td>{/* Am Frig */}
                  <td>{this.getLevel(3330)}</td>{/* Cal Frig */}
                  <td>{this.getLevel(3328)}</td>{/* Gal Frig */}
                  <td>{this.getLevel(3329)}</td>{/* Min Frig */}
                </tr>
                <tr>
                  <th scope="row">Destroyer</th>
                  <td>{this.getLevel(33091)}</td>{/* Am Des */}
                  <td>{this.getLevel(33092)}</td>{/* Cal Des */}
                  <td>{this.getLevel(33094)}</td>{/* Gal Des */}
                  <td>{this.getLevel(33093)}</td>{/* Min Des */}
                </tr>
                <tr>
                  <th scope="row">Cruiser</th>
                  <td>{this.getLevel(3335)}</td>{/* Am Cruis */}
                  <td>{this.getLevel(3334)}</td>{/* Cal Cruis */}
                  <td>{this.getLevel(3332)}</td>{/* Gal Cruis */}
                  <td>{this.getLevel(3333)}</td>{/* Min Cruis */}
                </tr>
                <tr>
                  <th scope="row">Battlecruiser</th>
                  <td>{this.getLevel(3331)}</td>{/* Am BC */}
                  <td>{this.getLevel(3330)}</td>{/* Cal BC */}
                  <td>{this.getLevel(3328)}</td>{/* Gal BC */}
                  <td>{this.getLevel(3329)}</td>{/* Min BC */}
                </tr>
                <tr>
                  <th scope="row">Battleship</th>
                  <td>{this.getLevel(3339)}</td>{/* Am BS */}
                  <td>{this.getLevel(3338)}</td>{/* Cal BS */}
                  <td>{this.getLevel(3336)}</td>{/* Gal BS */}
                  <td>{this.getLevel(3337)}</td>{/* Min BS */}
                </tr>
                <tr>
                  <th scope="row">T3D</th>
                  <td>{this.getLevel(34390)}</td>{/* Am T3D */}
                  <td>{this.getLevel(35680)}</td>{/* Cal T3D */}
                  <td>{this.getLevel(35685)}</td>{/* Gal T3D */}
                  <td>{this.getLevel(34533)}</td>{/* Min T3D */}
                </tr>
                <tr>
                  <th scope="row">T3C</th>
                  <td>{this.getLevel(30650)}</td>{/* Am T3C */}
                  <td>{this.getLevel(30651)}</td>{/* Cal T3C */}
                  <td>{this.getLevel(30652)}</td>{/* Gal T3C */}
                  <td>{this.getLevel(30653)}</td>{/* Min T3C */}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Am</th>
                  <th scope="col">Cal</th>
                  <th scope="col">Gal</th>
                  <th scope="col">Min</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Carrier</th>
                  <td>{this.getLevel(24311)}</td>{/* Am Carr */}
                  <td>{this.getLevel(24312)}</td>{/* Cal Carr */}
                  <td>{this.getLevel(24313)}</td>{/* Gal Carr */}
                  <td>{this.getLevel(24314)}</td>{/* Min Carr */}
                </tr>
                <tr>
                  <th scope="row">Dread</th>
                  <td>{this.getLevel(20525)}</td>{/* Am Dread */}
                  <td>{this.getLevel(20530)}</td>{/* Cal Dread */}
                  <td>{this.getLevel(20531)}</td>{/* Gal Dread */}
                  <td>{this.getLevel(20532)}</td>{/* Min Dread */}
                </tr>
                <tr>
                  <th scope="row">FAX</th>
                  <td>{this.getLevel(40535)}</td>{/* Am Fax */}
                  <td>{this.getLevel(40536)}</td>{/* Cal Fax */}
                  <td>{this.getLevel(40537)}</td>{/* Gal Fax */}
                  <td>{this.getLevel(40538)}</td>{/* Min Fax */}
                </tr>
                <tr>
                  <th scope="row">Titan</th>
                  <td>{this.getLevel(3347)}</td>{/* Am Tit */}
                  <td>{this.getLevel(3346)}</td>{/* Cal Tit */}
                  <td>{this.getLevel(3344)}</td>{/* Gal Tit */}
                  <td>{this.getLevel(3345)}</td>{/* Min Tit */}
                </tr>
                <tr>
                  <th scope="row">Industrial</th>
                  <td>{this.getLevel(3343)}</td>{/* Am Indy */}
                  <td>{this.getLevel(3342)}</td>{/* Cal Indy */}
                  <td>{this.getLevel(3340)}</td>{/* Gal Indy */}
                  <td>{this.getLevel(3341)}</td>{/* Min Indy */}
                </tr>
                <tr>
                  <th scope="row">Freighter</th>
                  <td>{this.getLevel(20524)}</td>{/* Am Freight */}
                  <td>{this.getLevel(20526)}</td>{/* Cal Freight */}
                  <td>{this.getLevel(20527)}</td>{/* Gal Freight */}
                  <td>{this.getLevel(20528)}</td>{/* Min Freight */}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {this.getLevel(12095, true, "Missing")} {/* Assault Frigates */}
            {this.getLevel(12093, true, "Missing")} {/* Covert Ops */}
            {this.getLevel(28615, true, "Missing")} {/* Electronic Attack Ships */}
            {this.getLevel(12092, true, "Missing")} {/* Interceptors */}
            {this.getLevel(40328, true, "Missing")} {/* Logistics Frigates */}

            {this.getLevel(37615, true, "Missing")} {/* Command Destroyers */}
            {this.getLevel(12098, true, "Missing")} {/* Interdictors */}

            {this.getLevel(16591, true, "Missing")} {/* Heavy Assault Cruisers */}
            {this.getLevel(28609, true, "Missing")} {/* Heavy Interdiction Cruisers */}
            {this.getLevel(12096, true, "Missing")} {/* Logistics Cruisers */}
            {this.getLevel(22761, true, "Missing")} {/* Recon Ships */}

            {this.getLevel(23950, true, "Missing")} {/* Command Ships */}
            
            {this.getLevel(28656, true, "Missing")} {/* Black Ops */}
            {this.getLevel(28667, true, "Missing")} {/* Marauders */}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {this.getLevel(32918, true, "Missing")} {/* Mining Frigate */}
            {this.getLevel(33856, true, "Missing")} {/* Expedition Frigates */}

            {this.getLevel(17940, true, "Missing")} {/* Mining Barge */}
            {this.getLevel(22551, true, "Missing")} {/* Exhumers */}

            {this.getLevel(28374, true, "Missing")} {/* Capital Industrial Ships */}
            {this.getLevel(29637, true, "Missing")} {/* Industrial Command Ships */}

            {this.getLevel(34327, true, "Missing")} {/* ORE Freighter */}
            {this.getLevel(3184, true, "Missing")} {/* ORE Industrial */}

            {this.getLevel(19719, true, "Missing")} {/* Transport Ships */}
          </div>
        </div>
      </div>
    )
  }
}

export default SkillHighlight