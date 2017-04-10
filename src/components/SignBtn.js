import React from 'react';
import $ from 'jquery';
import socket from '../socket/socket'

class SignBtn extends React.Component {
    constructor(props) {
        super(props)
    }

    logout() {
        $.ajax({
            type: 'GET'
            , url: '/user/signout'
            , success: (datas) => {
                if (datas.state === 'success') {
                    location.reload()
                } else {
                    console.log('获取数据失败，请稍后再试')
                }
            }
            , error: () => {
                console.log('连接失败，请稍后再试')
            }
        })
    }

    render() {
        let {name, onSign} = this.props;
        let html;
        if (name) {
            let logIn = {
                text: name
            };
            let logOut = {
                text: '退出'
            };
            html = (
                <div className="user">
                    <div className="signIn">
                        <span>
                            {logIn.text}
                        </span>
                    </div>
                    <div className="signUp">
                        <a onClick={e => {
                            e.preventDefault();
                            this.logout();
                        }}>
                            {logOut.text}
                        </a>
                    </div>
                </div>
            )
        } else {
            let signIn = {
                text: '登陆'
            };
            html = (
                <div className="user">
                    <div>
                        <a>
                            游客
                        </a>
                    </div>
                    <div className="signIn">
                        <a onClick={e => {
                            e.preventDefault();
                            onSign(signIn.text)
                        }}>
                            {signIn.text}
                        </a>
                    </div>
                </div>
            )
        }
        return html;
    }
}

export default SignBtn;
