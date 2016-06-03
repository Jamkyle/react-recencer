import React from 'react'
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import ActionRestore from 'material-ui/svg-icons/action/restore';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import {firebase, helpers} from 'redux-react-firebase'
import {connect} from 'react-redux'
import {Link} from 'react-router-redux'

const {dataToJS} = helpers

@firebase(['sections'])
@connect( (state) => ({
  sections : dataToJS(state.firebase, 'sections')
})
)
class Trash extends React.Component{
  restore(id){
      const {firebase} = this.props
      firebase.set(`sections/${id}/delete`, false)
  }
  deletePerm(id){
      const {firebase} = this.props
      firebase.remove(`sections/${id}`)

  }

  render(){
    const { sections } = this.props
      let listRemove =  _.map(sections, (section, id) => {
         if(section.delete)
         return (
           <div key={id}>
           <ListItem rightIconButton={
             <IconButton
              tooltip='restore'
              onClick={
                () => this.restore(id)
              }
            >
              <ActionRestore />
            </IconButton>
            }
            >
            {section.name}
            </ListItem>
            <IconButton
            tooltip='delete permanently'
            onClick={
              () => this.deletePerm(id)
            }
            >
              <ActionDeleteForever />
            </IconButton>
            </div>
        )
      })
    return <div>{listRemove}</div>
  }

}

export default Trash
