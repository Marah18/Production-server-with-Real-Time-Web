import * as dotenv from 'dotenv'

dotenv.config()


// to check the validity of an incoming request based on a secret token
// helps ensure that the webhooks received by the application come from GitLab
const authenticateHelper = (req, res, next) => {
  console.log(req);
  const gitlabToken = req.headers['x-gitlab-token'];

  if (gitlabToken === process.env.GITLAB_SECRET_TOKEN) {
    return next();
  } else {
    return res.status(403).send('Forbidden: Invalid token');
  }
};

export default authenticateHelper;