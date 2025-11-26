import React, { Component } from "react";
import Image from "../../../components/Image/Image";
import "./SinglePost.css";
const API = "https://my-backend-vnhm.onrender.com";

class SinglePost extends Component {
  state = {
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
    creatorId: "", // Add this to store post creator's ID
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    fetch(`${API}/feed/post/` + postId, {
      headers: { Authorization: "Bearer " + this.props.token },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json();
      })
      .then((resData) => {
        this.setState({
          title: resData.post.title,
          author: resData.post.creator.name,
          image: `${API}/` + resData.post.imageUrl,
          date: new Date(resData.post.createdAt).toLocaleDateString("en-US"),
          content: resData.post.content,
          creatorId: resData.post.creator._id, // Store creator ID
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  editHandler = () => {
    // Navigate to edit page or open edit modal
    this.props.history.push(`/edit-post/${this.props.match.params.postId}`);
  };

  deleteHandler = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      fetch(`${API}/feed/post/` + this.props.match.params.postId, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + this.props.token },
      })
        .then((res) => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Deleting post failed!");
          }
          return res.json();
        })
        .then((resData) => {
          console.log(resData);
          this.props.history.push("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    const canEdit = this.state.creatorId === this.props.userId;

    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>

        {/* Show edit/delete buttons only to post owner */}
        {canEdit && (
          <div className="single-post__actions">
            <button className="btn" onClick={this.editHandler}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={this.deleteHandler}>
              Delete
            </button>
          </div>
        )}

        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
