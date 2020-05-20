import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Link } from "react-router-dom";




class Auth extends Component {
    state = {
        name: '',
        password: '',
        hash:''
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            hash:this.state.name
        })
        console.log(this.state)
    }

    goBack(e) {
        e.preventDefault();
        this.props.history.goBack();
    }

    render() {
        console.log(this.state.name)
        if (this.state.hash) return <Redirect to={`/rooms/${this.state.hash}`} />

        return (
            <div className='fl w-100 pa2'>
                <button className='pa2 b--black input-reset ba bg-transparent mt4s mt3 pl4'>
                    <Link to={`/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    Back To Main Page
                    </Link>
                </button>
                <label className='tc f1 fl w-100'>Join A Room</label>
                <div className=' fl w-60 pl7 mt4 ma7'>
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
                                <Link to={`/rooms/${this.state.name}`} style={{ textDecoration: 'none', color: 'inherit' }} >Join</Link>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )

    }
}


export default Auth