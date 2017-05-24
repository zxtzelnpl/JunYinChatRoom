import React from 'react';
import SignBtn from '../containers/SignBtn'

class Header extends React.Component {
    render() {
        let url;
        iRoom.pictures.forEach(function (picture) {
            if(picture.position==='title'){
                url=picture.urlBack;
            }
        });
        return (
            <div className="header">
                <div className="title">
                    <img src={iRoom.staticUrl+url} alt=""/>
                </div>
                <div className="onLines">
                    <span>在线人数：</span><span>{this.props.number}</span>
                </div>
                <SignBtn />
            </div>
        )
    }
}

export default Header;
