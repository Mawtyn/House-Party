import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Grid } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default function Room(props) {
  const initialState = {
    votes_to_skip: 2,
    guest_can_pause: false,
    is_host: false,

    //   title: "title",
    //   artist: "artist",
    //   duration: 0,
    //   time: 0,
    //   image_url: "album_cover",
    //   is_playing: false,
    //   votes: 0,
    //   id: "id",
  };

  // var songJ = {
  //   title: "title",
  //   artist: "artist",
  //   duration: 0,
  //   time: 0,
  //   image_url: "album_cover",
  //   is_playing: false,
  //   votes: 0,
  //   id: "",
  // };

  const [roomState, setRoomState] = useState(initialState);
  const { roomCode } = useParams();
  const [show_settings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});
  const [mount, setMount] = useState(false);

  const [title, setTitle] = useState("title");
  const [artist, setArtist] = useState("artist");
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [image_url, setImage_url] = useState("image_url");
  const [is_playing, setIs_playing] = useState("is_playing");
  const [votes, setVotes] = useState(0);
  const [votes_required, setVotes_required] = useState(2);
  const [id, setId] = useState("id");

  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);

  let navigate = useNavigate();
  // getRoomDetails();

  // useEffect(() => {
  //   getRoomDetails();
  // }, [spotifyAuthenticated, show_settings]);

  useEffect(() => {
    getRoomDetails();
    // getCurrentSong();
    // setMount({mount: true});
  }, [roomState.is_host]);

  var interval;
  // useEffect(() => {
  //   const cancel = false;
  //   if (!cancel) {
  //     // interval = setInterval(getCurrentSong, 1000);
  //     getCurrentSong();
  //   }

  //   return () => {
  //     cancel = true;
  //     //clearInterval(interval)
  //   };
  // }, []);

  var delayInMil = 1000;

  useEffect(() => {
    if (mount) {
      // interval = setInterval(getCurrentSong, 1000);
      getCurrentSong();
      setJ(j + 1);
    }
  }, [i]);

  useEffect(() => {
    if (mount) {
      setTimeout(() => {
        setI(i + 1);
      }, [delayInMil]);
    }
  }, [j]);

  // var interval;
  // useEffect(() => {
  //   // setMount({mount: true})

  //   if (!mount) {
  //     console.log('ran');
  //     clearInterval(interval);
  //     // interval = setInterval(getCurrentSong, 1000);
  //   // // getCurrentSong();
  //   // // setMount({mount: false})
  //   }
  // }, [mount]
  // );

  let getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setSong({ song: data });
        // }).then((data) => {updateSong(data);
        // console.log(data.title);
        // console.log(data.title);
        setTitle({ title: data.title });
        setArtist({ artist: data.artist });
        setDuration({ duration: data.duration });
        setTime({ time: data.time });
        setImage_url({ image_url: data.image_url });
        setIs_playing({ is_playing: data.is_playing });
        setVotes({ votes: data.votes });
        setVotes_required({votes_required: data.votes_required});
        setId({ id: data.id });
        // songJ.title = data.title
        // songJ.artist = data.artist
        // songJ.duration = data.duration
        // songJ.time = data.time
        // songJ.image_url = data.image_url
        // songJ.is_playing = data.is_playing
        // songJ.votes = data.votes
        // songJ.id = data.id

        // setRoomState({
        //   title: data.title,
        //   artist: data.artist,
        //   duration: data.duration,
        //   time: data.time,
        //   image_url: data.image_url,
        //   is_playing: data.is_playingartist,
        //   votes: data.votes,
        //   id: data.id
        // });
      });

    // console.log(title);
    // console.log(song.song["title"]);
  };

  // let godSend = () => {
  //   while (mount){
  //     i++;
  //   }

  // }

  let getRoomDetails = () => {
    setMount({ mount: true });
    setI(i + 1);
    // interval = setInterval(getCurrentSong, 1000);
    // getCurrentSong();
    // componentDidMount();
    // console.log("hi")
    fetch("/api/get-room" + "?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
          props.leaveRoomCallback();
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setRoomState({
          votes_to_skip: data.votes_to_skip,
          guest_can_pause: data.guest_can_pause,
          is_host: data.is_host,
        });
        if (roomState.is_host) {
          authenticateSpotify();
        }
      });
  };

  // let updateShowSettings = (value) => {
  //   setShowSettings({
  //     show_settings: value,
  //   });
  // }

  let authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        // console.log(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };

  // async componentDidMount() {
  //   fetch("/api/user-in-room")
  //     .then((response) => response.json())
  //     .then((data) =>
  //       this.setState({
  //         roomCode: data.code,
  //       })
  //     );
  // }

  //  let processor = () => {
  //   getCurrentSong();
  //   clearInterval(interval);
  //  }

  // var interval = setInterval(processor, 1000);
  // clearInterval(interval);

  let leaveButtonPressed = () => {
    // clearInterval(interval);
    // console.log(artist);
    // componentWillUnmount(interval);
    setMount({ mount: false });
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      props.leaveRoomCallback();
      navigate("/");
    });
    //  clearInterval(interval);
  };

  let updateShowSettings = (value) => {
    setShowSettings({
      show_settings: value,
    });
  };

  let updateSong = (value) => {
    setSong({
      song: value,
    });
  };
  // let updateSong = (value) => {
  //   setSong({
  //     song: value
  //   }
  //   {getCurrentSong()}
  //   );
  // }

  let renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votes_to_skip={roomState.votes_to_skip}
            guest_can_pause={roomState.guest_can_pause}
            roomCode={roomCode}
            updateCallBack={() => {
              getRoomDetails();
            }}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  let renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  // if (show_settings) {
  //   console.log(show_settings)
  //   console.log("this should not run!")
  //   return renderSettings();
  // }
  return show_settings.show_settings ? (
    renderSettings()
  ) : (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <MusicPlayer
        title = {title.title}
        artist = {artist.artist}
        duration = {duration.duration}
        time = {time.time}
        image_url = {image_url.image_url}
        is_playing = {is_playing.is_playing}
        votes = {votes.votes}
        votes_required = {votes_required.votes_required}
        id = {id.id}
      />
      {roomState.is_host ? renderSettingsButton() : null}
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}
