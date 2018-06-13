import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import './Content.css';
import * as actions from '../actions/player';
import * as playlistActions from '../actions/playlist';
import Result from '../components/Result';
import API from '../utils/api';

class Content extends Component {
  isSongChosen(id){
    const { playlistState, lists } = this.props.playlist;
    return lists.queue[playlistState.key] && lists.queue[playlistState.key].id === id
  }

  render() {
    const { results, actions, playlist, player } = this.props;
    const { playlistState, lists } = playlist;
    const renderContent = results.search.result.map((result,i) =>
      <Result
        onClick={() => !this.isSongChosen(result.ranked_id) ?
          actions.setSong(getSongData(result)) :
          actions.togglePause()
        }
        onPlaylistAdd={() => actions.addToPlaylist(getSongData(result))}
        background={API.getImage(result.ranked_id, 180, 180)}
        artist={result.title.split("-")[0]}
        songName={result.title.split("-")[1]}
        isPlaying={this.isSongChosen(result.ranked_id) && !player.pause} // TODO MAKE IT SMALLER
        className="content__result result"
        key={i}
      />
    );
    return (
      <div className="content">
        <div className="content__wrapper">
        {
          results.search.query &&
          <h1 className="content__query">
            Search for {results.search.query}
          </h1>
        }
        <div className="content__results">
          {renderContent}
        </div>
        </div>
      </div>
    );
  }

}
const getSongData = (result) => ({
  key: 'queue',
  data: {
    id: result.ranked_id,
    name: result.title,
    url: API.getSong(result.ranked_id),
    image: API.getImage(result.ranked_id, 128, 128),
  }
})

const mapStateToProps = (state, ownProps) => ({
  results: state.results,
  playlist: state.playlist,
  player: state.player,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    setSong: (id) => dispatch(actions.setSong(id)),
    togglePause: (pause) => dispatch(actions.togglePause()),
    addToPlaylist: (key, data) => dispatch(playlistActions.addToPlaylist(key,data))
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(Content);
