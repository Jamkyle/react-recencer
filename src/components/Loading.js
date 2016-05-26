import React, {Component} from 'react'

export default class Loading extends Component{
  state = {pt: '', inter : null}
  componentWillUnmount(){
    clearInterval(this.state.inter)
  }
  componentDidMount(){
        let { pt } = this.state
        this.state.inter = setInterval(()=>{this.setState({pt: '. '+pt})}, 300)
  }

  render(){
    let { pt } = this.state
    return <div>Loading {pt}</div>
  }
}
