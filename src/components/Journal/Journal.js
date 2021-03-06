import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';


class Journal extends Component {
    constructor() {
        super()
        this.state = {
            journalEntry: '',
            date: '',
            time: '',
            title: ''
        }
      }

      handleJournalPost(post) {
        axios.post(`${process.env.REACT_APP_HOST}/api/journal`, {
            journal_entry: this.state.journalEntry,
            journal_date: this.state.date,
            journal_time: this.state.time,
            journal_title: this.state.title
        })
        this.setState({
            journalEntry: '',
            date: '',
            time: '',
            title: ''
        })
      }
      handleJournalInput(input) {
        this.setState({
            journalEntry: input
        })
      }
      handleDate(input) {
        this.setState({
            date: input
        })
      }
      handleTime(input) {
        this.setState({
            time: input
        })
      }

      handleTitle(input) {
              this.setState({
                  title: input
              })
      }

    
    render() {
        console.log(this.state);
        return(
            <div className="BGjournal">
                <div>
                    <div className="headerJournal"><div className="journalTitle">Journal</div></div>
                    <div className="bodyJournal">    
                        <div className="sidebarJournal"></div>
                        <div className="mainJournal">
                            <div className="planTitle"><div>Create an Updated Journal</div></div>                        
                                <div className='dateTime'>
                                    <div>Title&emsp;&emsp;</div>
                                    <div><input className="titleJournal" type="text" value={this.state.title} onChange={(e) => this.handleTitle(e.target.value)}/></div>
                                    <div>&emsp;&emsp;Date&emsp;&emsp;</div>
                                    <div><input className='date' type='date' value={this.state.date} onChange={(e) => this.handleDate(e.target.value)}/></div>
                                    <div>&emsp;&emsp;Time&emsp;&emsp;</div>
                                    <div><input type='time' value={this.state.time} onChange={(e) => this.handleTime(e.target.value)}/></div>
                                </div>
                                <div className="journalParent">
                                    <div className="textJournal">
                                        <textarea value={this.state.journalEntry} className="journal-input" type="text" onChange={(e) => this.handleJournalInput(e.target.value)} />
                                    </div>
                                </div>
                                <div className="submitParentJour">
                                    <a>
                                        <div className="submit-btn" onClick={() => this.handleJournalPost()} >
                                            <h3 className="submit-text" >Submit</h3>
                                        </div>
                                    </a>
                                </div>
                        </div>
                    </div>

                    <div className="footer">
                        <div className="plans3">
                            <Link to="/dashboard" className="LinkGoals"><div className="planbtn1">Dashbord</div></Link>
                            <Link to="/goals" className="LinkGoals"><div className="planbtn2">Goals</div></Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Journal;