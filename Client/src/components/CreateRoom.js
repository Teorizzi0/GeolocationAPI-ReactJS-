import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Link } from "react-router-dom";

// import { Redirect } from 'react-router-dom'




class CreateRoom extends Component {
    state = {
        name: '',
        password: '',
        onCall:''
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        
        this.setState({
            onCall:this.state.name
        })
        console.log(this.state)
    }

    goBack(e) {
        e.preventDefault();
        this.props.history.goBack();
    }

    render() {
        console.log(this.state.name)
        if (this.state.onCall) return <Redirect to={{pathname:`/rooms/${this.state.onCall}`}} />

        return (
            <div className="center">
                <div >
                    <button
                        className='pa2 b--black input-reset ba bg-transparent mt4'
                        onClick={e => { this.goBack(e) }}
                    >
                        Back
                </button>
                    <form className="center mt5">
                        <div className="input-field mt3  center">
                            <label htmlFor="password" className="db fw4 lh-copy f6">Room Name<br /></label>
                            <input
                                className='pa2 input-reset ba bg-transparent w-100 measure'
                                type="name"
                                id="name"
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="mt3 center">
                            <button onClick={this.handleSubmit} type='submit' defaultValue='Create' className="pa2 b--black input-reset ba bg-transparent">
                                Create
                                {/* <Link to={`/room/${this.state.name}`} style={{ textDecoration: 'none', color: 'inherit' }} >Create</Link> */}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )

    }
}


export default CreateRoom
