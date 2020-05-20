import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Link } from "react-router-dom";
import Map from './Map'
import UserList from './UserList'
import UserListR from './UserListR'
import LocationService from './LocationService'



class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.match.params.id,
        };
    }

    leaveRoom =()=>{
        window.socket.emit('leave')
    }

    render() {
        console.log(this.state.name)

        return (
            <div >
                <button onClick={this.leaveRoom} className='pa2 b--black input-reset ba bg-transparent mt4s mt3 pl4'>
                    <Link to={`/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        Back To Main Page
                    </Link>
                </button>
                <div>
                    <div className='fl w-40 pl5 mt4'>
                        {/* <UserList isRoom={true} room={this.state.name}/> */}
                        <UserListR room={this.state.name} />

                        <LocationService />
                    </div>
                    <div className='fr w-40 pa1 mt3'>
                        <Map />
                    </div>
                </div>
            </div>
        )

    }
}


export default Room