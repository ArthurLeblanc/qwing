class Status extends React.Component {
  render() {
    return (
      <div className="col-6 offset-3">
        <div className="card">
          <div className="card-block">
            <div className="row">
              <div className="col-10 profile-row">
                <div className="row">
                  <a href="#">The Zen of Programming</a>
                </div>
                <div className="row">
                  <small className="post-time">10 mins</small>
                </div>
              </div>
            </div>
+           <Like />
          </div>
          <div className="card-footer text-muted">
            <Comment />
          </div>
        </div>
      </div>
    )
  }
}

class Comment extends React.Component {
  render() {
    return (
      <div>
        <textarea className="form-control" placeholder="Write a comment..." />
        <small>140 Remaining</small>
      </div>
    )
  }
}

class LikeIcon extends React.Component {
  render() {
    return (
      <div>
        <span className="fa-stack fa-sm">
          <i className="fa fa-circle fa-stack-2x blue-icon" />
          <i className="fa fa-thumbs-up fa-stack-1x fa-inverse" />
        </span>
      </div>
    )
  }
}

class Like extends React.Component {
  render() {
    return (
      <div>
        {/* Inclut le sous-composant LikeIcon à l'intérieur du composant Like*/}
        <LikeIcon />
        <hr />
        <div>
          <button type="button">
            <i
              className="fa fa-thumbs-o-up fa-4 align-middle"
              aria-hidden="true"
            />
            &nbsp;
            <span className="align-middle">Like</span>
          </button>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Status />, document.getElementById("root"))