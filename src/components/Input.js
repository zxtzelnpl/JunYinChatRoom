import React from 'react';
import socket from '../socket/socket';

/*对用户输入进行处理*/
function format(str){
    const reg1 = /(^\s*)|(\s*$)/g;
    const reg3 = /</g;
    const reg4 = />/g;
    return str.replace(reg1, "").replace(reg3, "&lt;").replace(reg4, "&gt;")
}

const emojisNum = 28;

function Box({i}) {
    let url = '/images/emoji/' + i + '.jpg';
    return (<div className="box"><img src={url}/></div>)
}

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            html: '请在此处输入内容',
            emojiStyle: {display: 'none'}
        };
        this._range = {
            node: null,
            offset: 0
        };
    }

    clearPlaceholder() {
        if (this.state.html === '请在此处输入内容') {
            this.setState({html:''});
        }
    }

    saveRange() {
        let selection = window.getSelection();
        this._range = {
            node: selection.anchorNode,
            offset: selection.anchorOffset
        };
    }

    showEmoji() {
        this.clearPlaceholder.call(this);
        if (this.state.emojiStyle.display === 'none') {
            this.setState({
                emojiStyle: {display: 'block'}
            })
        } else {
            this.setState({
                emojiStyle: {display: 'none'}
            })
        }
    }

    insertEmoji(e) {
        let node, offset,img;
        if (e.target.nodeName !== 'IMG') {
            return
        }
        if (!this._range) {
            return
        }
        img = new Image();
        img.src = e.target.src;
        node = this._range.node;
        offset = this._range.offset;
        if (node.nodeType === 1 && this._range.offset === undefined) {
            console.log('node是img');
            console.log(node);
            node.parentNode.insertBefore(img, node.nextSibling);
            this._range.node = img;
            this.setState({html:node.parentNode.innerHTML});
            return;
        }
        if (node.nodeType === 1) {
            console.log('node是div');
            let childNodes = node.childNodes;
            node.insertBefore(img, childNodes[offset]);
            this._range.offset++;
            this.setState({html:node.innerHTML});
            return;
        }
        if (node.nodeType === 3) {
            console.log('node是text');
            let value = node.nodeValue;
            let parent = node.parentNode;
            let fragment = document.createDocumentFragment();
            let textNodeBefore = document.createTextNode(value.slice(0, offset));
            let textNodeAfter = document.createTextNode(value.slice(offset));
            fragment.appendChild(textNodeBefore);
            fragment.appendChild(img);
            fragment.appendChild(textNodeAfter);
            parent.replaceChild(fragment, node);
            this._range.node = img;
            this._range.offset = undefined;
            this.setState({html:parent.innerHTML});
        }
    }
    submit(){
        let name = document.querySelector('.signIn>span') ? document.querySelector('.signIn>span').innerHTML : undefined;
        if (name) {
            let content = format(this.state.html);
            socket.emit('message', {
                content: content,
                room: iRoom._id
            });
        } else {
            alert('登录后可发送信息');
        }
    }

    handleKeyup(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.keyCode === 13 && e.ctrlKey) {
            this.submit.call(this)
        }else{
            this.setState({
                html:this.textarea.innerHTML
            })
        }
    }

    handleClick(e) {
        e.preventDefault();
        this.submit.call(this)
    }

    render() {
        let emojiHtml = [];
        for (let i = 1; i <= emojisNum; i++) {
            emojiHtml.push(<Box i={i} key={i}/>)
        }

        return (
            <div className="chatInputBox">
                <div>
                    <div
                        className="chatMessage"
                        contentEditable="true"
                        id="chatMessage"
                        ref={(textarea) => {
                            this._range.node = this.textarea = textarea
                        }}
                        onBlur={this.saveRange.bind(this)}
                        onFocus={this.clearPlaceholder.bind(this)}
                        onKeyUp={this.handleKeyup.bind(this)}
                        dangerouslySetInnerHTML={{__html:this.state.html}}
                    ></div>
                </div>
                <div>
                    <a className="btn" onClick={this.handleClick.bind(this)}>提交</a>
                </div>
                <div>
                    <a className="btn" onClick={this.showEmoji.bind(this)}>表情</a>
                </div>
                <div className="emoji" style={this.state.emojiStyle} onClick={this.insertEmoji.bind(this)}>
                    {emojiHtml}
                </div>
            </div>
        )
    }
}

export default Input;
