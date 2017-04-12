const messages = (state = INITIAL_STATE_MES, action) => {
    let newState=new iMap();
    switch (action.type) {
        case 'ADD':
            for(let key in state){
                newState.set(state[key])
            }
            action.messages.forEach(function(message){
                newState.set(message);
            });
            console.log(newState);
            return newState;
        case 'CHECK':
            for(let i=0;i<state.length;i++){
                if(state[i]._id===action.messages._id){
                    state[i].check=true;
                }
                newState[i]=state[i];
            }
            return newState;
        case 'DEL':
            for(let i=0;i<state.length;i++){
                if(state[i]._id!==action.messages._id){
                    newState.push(state[i]);
                }
            }
            return newState;
        case 'BACK':
            return state.concat(action.messages);
        default:
            return state
    }
};

export default messages;
