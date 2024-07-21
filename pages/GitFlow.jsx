import React from "react";
import ReactDOM from "react-dom";
import { Gitgraph, templateExtend } from "@gitgraph/react";
const GitFlow = () => {
  let options = {
  orientation: "horizontal-reverse",
  template: templateExtend("metro", {
    commit: {
      message: {
        displayAuthor: false,
        displayHash: false
      }
    }
  })
};
return (
   <Gitgraph options={options}>
     {(gitgraph) => {
              const master = gitgraph.branch('new');
               master.commit('Init').tag('master');
               const open = master.branch('open');
               open.commit('open');
               const assigned = open.branch('assigned');
               assigned.commit('assigned');
               const inProgress = assigned.branch('in progress');
               inProgress.commit('in progress');
               const toApprove = inProgress.branch('to approve');
               toApprove.commit('to approve');
               const Approved = toApprove.branch('Approved');
               Approved.commit('Approved');
               const toReopen = toApprove.branch('to Reopened');
               toReopen.commit('to reopen');

         inProgress.merge(toReopen);
               const reject = open.branch('reject');
               reject.commit('reject');
               const dupicate = open.branch('dupicate');
               dupicate.commit('dupicate');
               const future = open.branch('future');
               future.commit('future');
     }}
   </Gitgraph>
 );

}

export default GitFlow;
