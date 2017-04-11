import React from 'react';
import $ from 'jquery';
import IScroll from 'iscroll';

function Message({message}) {
    let DOMStr;
    let DOMcheck;
    if(iUser.level>999){
        if(iUser.check){
            DOMcheck=(<hr/>);
        }else{
            DOMcheck=
                (
                    <div className="manage">
                        <a className="check">审核</a>
                        <a className="del">删除</a>
                    </div>
                )
        }

        DOMStr=
            (
                <li className="message">
                    <div className="name">{message.from.name}:</div>
                    <div className="time">{new Date(message.createAt).toLocaleString()}</div>
                    <div className="content">{message.content}</div>
                    {DOMcheck}
                </li>
            )
    }else{
        DOMStr=
            (
                <li className="message">
                    <div className="name">{message.from.name}:</div>
                    <div className="time">{new Date(message.createAt).toLocaleString()}</div>
                    <div className="content">{message.content}</div>
                </li>
            )
    }
    return DOMStr;
}

class MessageBox extends React.Component {
    constructor(props) {
        super(props);
        this.canMove = 0;
        this.page = 1;
        this.pageLoad = false;
    }

    getMoreMessages() {
        console.log('getMoreMessages');
        let me = this;
        let page = me.page;

        $.ajax({
            type: 'GET'
            , url: '/getmessage'
            , data: {
                page
            }
            , success: (messages) => {
                me.pageLoad = true;
                me.props.getAll(messages);
                me.page++;
            }
            , error: () => {
                console.log('连接失败，请稍后再试')
            }
        })
    }

    componentDidMount() {
        console.log('componentDidMount');
        let me = this;
        let innerH = this.messages.scrollHeight;
        let outerH = this.messagesBox.clientHeight;
        console.log(innerH, outerH);
        let canMove = innerH - outerH;
        console.log(canMove);
        if (canMove < 0) {
            return;
        }
        this.canMove = canMove;
        this.myScroll = new IScroll('.messagesBox', {
            mouseWheel: true
            , scrollbars: true
            , interactiveScrollbars: true
            , startY: -this.canMove
            , resizeScrollbars: true
        });
        this.myScroll.on('scrollEnd', function () {
            if (this.directionY < 0 && this.y == 0) {
                console.log('加载数据');
                me.getMoreMessages()
            }
        });
    }

    componentDidUpdate() {
        console.log('componentDidUpdate');


        let innerH = this.messages.scrollHeight;
        let outerH = this.messagesBox.clientHeight;
        console.log(innerH, outerH);
        let canMove = innerH - outerH;
        console.log(canMove);
        if (canMove < 0) {
            return;
        }
        if (!this.myScroll) {
            this.canMove = canMove;
            this.myScroll = new IScroll('.messagesBox', {
                mouseWheel: true
                , scrollbars: true
                , interactiveScrollbars: true
                , startY: -this.canMove
                , resizeScrollbars: true
            });
        } else {
            if (canMove !== this.canMove) {
                this.canMove = canMove;
                this.myScroll.refresh();
                if (this.pageLoad) {
                    this.pageLoad = false;
                    this.myScroll.scrollTo(0, 0, 500, IScroll.utils.ease.ease);
                } else {
                    this.myScroll.scrollTo(0, -this.canMove, 500, IScroll.utils.ease.ease);
                }
            }
        }
    }

    render() {
        let messages = this.props.messages.sort(function (a, b) {
            return new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
        });

        let messagesBox = messages.map((message, index) => (
            <Message key={index} message={message}/>
        ));

        return (
            <div
                className="messagesBox"
                ref={(box) => {
                    this.messagesBox = box
                }}
            >
                <ul
                    style={this.state}
                    ref={(ul) => {
                        this.messages = ul
                    }}
                >
                    {messagesBox}
                </ul>
            </div>
        )
    }
}

export default MessageBox
