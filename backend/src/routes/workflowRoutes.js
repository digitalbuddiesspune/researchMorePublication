import { Router } from 'express'
import {
  assignReviewer,
  createSubmission,
  getEditorSubmissionDetail,
  getMySubmissionDetail,
  getReviewerAssignmentDetail,
  getReviewerSubmissionDetail,
  listAssignedReviews,
  listEditorSubmissions,
  listReviewers,
  listMySubmissions,
  listSubmissionMessages,
  postSubmissionMessage,
  setEditorDecision,
  submitReview,
  uploadSubmissionAsset,
  uploadSubmissionFiles,
  uploadRevision,
} from '../controllers/workflowController.js'
import { authRequired } from '../middleware/authRequired.js'
import { requireRole } from '../middleware/requireRole.js'
import { uploadSubmissionFile } from '../middleware/uploadSubmissionFile.js'

const workflowRouter = Router()

workflowRouter.post('/submissions', authRequired, requireRole(['author']), createSubmission)
workflowRouter.get('/submissions/my', authRequired, requireRole(['author']), listMySubmissions)
workflowRouter.get('/submissions/my/:id', authRequired, requireRole(['author']), getMySubmissionDetail)
workflowRouter.patch('/submissions/:id/revision', authRequired, requireRole(['author']), uploadRevision)
workflowRouter.patch('/submissions/:id/files', authRequired, requireRole(['author']), uploadSubmissionFiles)
workflowRouter.post(
  '/submissions/upload-file',
  authRequired,
  requireRole(['author']),
  uploadSubmissionFile,
  uploadSubmissionAsset
)
workflowRouter.get('/submissions/:id/messages', authRequired, requireRole(['author', 'editor', 'admin']), listSubmissionMessages)
workflowRouter.post('/submissions/:id/messages', authRequired, requireRole(['author', 'editor', 'admin']), postSubmissionMessage)

workflowRouter.get('/reviewer/assignments', authRequired, requireRole(['reviewer']), listAssignedReviews)
workflowRouter.get('/reviewer/assignments/:id', authRequired, requireRole(['reviewer']), getReviewerAssignmentDetail)
workflowRouter.get('/reviewer/submissions/:id', authRequired, requireRole(['reviewer']), getReviewerSubmissionDetail)
workflowRouter.post('/reviewer/assignments/:id/submit', authRequired, requireRole(['reviewer']), submitReview)

workflowRouter.get('/editor/submissions', authRequired, requireRole(['editor', 'admin']), listEditorSubmissions)
workflowRouter.get('/editor/submissions/:id', authRequired, requireRole(['editor', 'admin']), getEditorSubmissionDetail)
workflowRouter.get('/editor/reviewers', authRequired, requireRole(['editor', 'admin']), listReviewers)
workflowRouter.post(
  '/editor/submissions/:id/assign-reviewer',
  authRequired,
  requireRole(['editor', 'admin']),
  assignReviewer
)
workflowRouter.post(
  '/editor/submissions/:id/decision',
  authRequired,
  requireRole(['editor', 'admin']),
  setEditorDecision
)

export default workflowRouter
