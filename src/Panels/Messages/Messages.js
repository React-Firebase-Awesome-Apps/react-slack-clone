import React, { Component, Fragment } from 'react'
import { Segment, Comment } from 'semantic-ui-react'

import MessagesHeader from './MessagesHeader'
import MessagesForm from './MessagesForm'

class Messages extends Component {
    state = {  }
    render() { 
        return ( 
        <Fragment>
            <MessagesHeader />

            <Segment raised>
                <Comment.Group className='messages' >
                    {/* Messages */}
                </Comment.Group>
            </Segment>

            <MessagesForm />
        </Fragment>
            );
    }
}
 
export default Messages;