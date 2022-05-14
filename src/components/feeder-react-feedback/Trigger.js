import React, { Component } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./Trigger-Styles.scss";

import Modal from "./Modal";
import FeedbackIcon from "@mui/icons-material/Feedback";
import CloseIcon from "@mui/icons-material/Close";

class Trigger extends Component {
  state = {
    modal: false,
  };

  triggerModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  render() {
    let { modal } = this.state;
    let { props } = this;

    return (
      <React.Fragment>
        <div
          className="frf-trigger-button"
          style={{
            background: props.primaryColor,
            color: props.textColor,
            zIndex: parseInt(props.zIndex),
          }}
          onClick={this.triggerModal}
        >
          <div
            className={modal ? "frf-feedback-icon-open" : "frf-feedback-icon"}
            style={{
              fill: props.textColor,
            }}
          >
            {modal ? <CloseIcon sx={{"font-size": "24px"}}/> : <FeedbackIcon  sx={{"font-size": "24px"}}/>}
          </div>
        </div>
        <TransitionGroup component={null}>
          {modal && (
            <CSSTransition
              in={modal}
              classNames="frf-dialog"
              timeout={{
                enter: 300,
                exit: 300,
              }}
            >
              <Modal
                email={props.email}
                subProject={props.subProject}
                emailRequired={props.emailRequired}
                emailDefaultValue={props.emailDefaultValue}
                projectName={props.projectName}
                projectId={props.projectId}
                feedbackTypes={props.feedbackTypes}
                primaryColor={props.primaryColor}
                textColor={props.textColor}
                hoverBorderColor={props.hoverBorderColor}
                postSubmitButtonMsg={props.postSubmitButtonMsg}
                submitButtonMsg={props.submitButtonMsg}
                triggerModal={this.triggerModal}
                modalOpen={this.state.modal}
                zIndex={props.zIndex}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </React.Fragment>
    );
  }
}

export default Trigger;
