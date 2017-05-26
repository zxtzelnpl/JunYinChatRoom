import React from 'react';
import socket from '../socket/socket';

const reg1 = /(^\s*)|(\s*$)/g;
const reg2 = /"/g;
const reg3 = /</g;
const reg4 = />/g;
const emojisNum=28;

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '请在此处输入内容',
            emojiStyle: {display: 'none'}
        }
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    handleFocus(e) {
        if (e.target.innerHTML === '请在此处输入内容') {
            e.target.innerHTML='';
        }
    }

    handleClick(e) {
        e.preventDefault();
        let name = document.querySelector('.signIn>span') ? document.querySelector('.signIn>span').innerHTML : undefined;
        if (name) {
            let content = this.textarea.value.replace(reg1, "").replace(reg3, "&lt;").replace(reg4, "&gt;");
            socket.emit('message', {
                content: content,
                room: iRoom._id
            });
        } else {
            alert('登录后可发送信息');
        }

    }

    showEmoji() {
        if(this.state.emojiStyle.display==='none'){
            this.setState({
                emojiStyle: {display: 'block'}
            })
        }else{
            this.setState({
                emojiStyle: {display: 'none'}
            })
        }
    }

    insertEmoji(e){
        this.textarea.innerHTML+=e.target.parentElement.innerHTML;
        console.log(e.target)
    }

    handleKeyup(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.keyCode === 13 && e.ctrlKey) {
            let name = document.querySelector('.signIn>span') ? document.querySelector('.signIn>span').innerHTML : undefined;
            if (name) {
                let content = this.textarea.value.replace(reg1, "").replace(reg3, "&lt;").replace(reg4, "&gt;");
                socket.emit('message', {
                    content: content,
                    room: iRoom._id
                });
            } else {
                alert('登录后可发送信息');
            }
        }else{
            // let str=this.state.value+e.key;
            // this.setState({
            //     value:str
            // })
        }
        // console.log(this.state.value)
    }

    render() {
        let emojiHtml=[];
        for(let i=1;i<=emojisNum;i++){
            let url='/images/emoji/'+i+'.jpg';
            emojiHtml.push(<div className="box" key={i}><img src={url} /></div>)
        }

        return (
            <div className="chatInputBox">
                <div>
                    <div
                        className="chatMessage"
                        contentEditable="true"
                        id="chatMessage"
                        cols="30"
                        rows="5"
                        value={this.state.value}
                        ref={(textarea) => {
                        this.textarea = textarea
                        }}
                        onFocus={this.handleFocus.bind(this)}
                    >
                        请在此处输入内容
                    </div>
                </div>
                <div className="emoji" style={this.state.emojiStyle} onClick={this.insertEmoji.bind(this)}>
                    {emojiHtml}
                </div>
                <div>
                    <a className="btn" onClick={this.handleClick.bind(this)}>提交</a>
                </div>
                <div>
                    <a className="btn" onClick={this.showEmoji.bind(this)}>表情</a>
                </div>
            </div>
        )
    }
}

export default Input;
