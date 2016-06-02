import React, {Component} from 'react'
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import DropDownMenu from 'material-ui/DropDownMenu';
import Popover from 'material-ui/Popover';

import {SUCCESS_ON_REGISTER} from 'const/messages'
import styles from 'styles/style'


export class ObjectSelect extends Component {
  state = {open : false, el : null}

  toggle(e, value){
    let list = value
    if(_.indexOf(value, e ) === -1)
      list = [...value, e]
    else
      _.pull(list, e)
    return list
  }


  render(){
    const { array, title, multiple, onBlur, onChange, options, value, ...rest, field } = this.props
    return (
      <div>
        <TextField name={title}
         value={_.map(value)}
         onTouchTap={ (e) => this.setState({ el:e.currentTarget, open : true}) }
         floatingLabelText={title}
        />
        <Popover
          open={ this.state.open }
          onRequestClose={
            ()=>this.setState({open:false})
          }
          anchorEl={ this.state.el }
          anchorOrigin={ {horizontal: 'right', vertical: 'bottom'} }
          targetOrigin={ {vertical:'bottom', horizontal:'middle'} }
        >
          <Menu
            multiple = { true }
            onChange = {
              (event) => {
                onChange( this.toggle(event.target.innerHTML, value) )
              }
            }
            value = { [...value] }
            {...rest}
          >
            {
              array.map(
                (element, id) => <MenuItem key={id} primaryText={ element[field] } value={ element[field] } />
              )
            }
          </Menu>
        </Popover>
      </div>
    )
  }
}
