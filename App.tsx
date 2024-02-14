import axios from "axios";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Searchbar, Text } from "react-native-paper";

interface TracksInterface {
  name: string;
  id: string;
  album: {
    name: string;
    artists: {
      name: string;
    }[];
    images: {
      height: number;
      width: number;
      url: string;
    }[];
  };
}

export default function App() {
  const [text, onChangeText] = useState("");
  const [tracks, setTracks] = useState<TracksInterface[] | undefined>([]);
  const [currentTrack, setCurrentTrack] = useState<
    TracksInterface | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const url = window.location.href;

  let token = url.split("access_token=")[1];
  // let refreshToken = url.split("refresh_token=")[1];

  const getRefreshToken = async () => {
    // TODO
    // Descobrir forma de validar se token venceu
    const refreshToken = window.location.href.split("refresh_token=")[1];
    const url = "https://accounts.spotify.com/api/token";

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    };
    const body = await fetch(url, payload);
    console.log(body);
    // const response await body.json();

    // localStorage.setItem('access_token', response.accessToken);
    // localStorage.setItem('refresh_token', response.refreshToken);
  };

  const getSongs = async () => {
    setIsLoading(true);
    const res = await axios
      .get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: text,
          type: "track",
          market: "BR",
        },
      })
      .then((res) => {
        setTracks(res.data.tracks.items as any);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.containerList}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeText}
        value={text}
      />

      {<a href="http://localhost:8888">Login Spotify</a>}
      <View style={styles.buttonGroup}>
        <Button
          icon="magnify"
          mode="contained"
          onPress={getSongs}
          loading={isLoading}
        >
          Buscar
        </Button>

        <Button mode="contained" onPress={() => setTracks([])}>
          Limpar
        </Button>
      </View>

      <FlatList
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View key={crypto.randomUUID()}>
            <Card style={{ marginTop: 30, width: 230 }}>
              <Card.Content>
                <Text variant="titleLarge">{item.name}</Text>
                <Text variant="bodyMedium">{item.album.name}</Text>
              </Card.Content>
              <View style={styles.containerImage}>
                <Card.Cover source={{ uri: item.album.images[1].url }} />
              </View>
              <Card.Actions
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: 0,
                  }}
                  onPress={() => console.log(item.name)}
                >
                  Adicionar
                </Button>
              </Card.Actions>
            </Card>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  containerList: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  containerImage: {
    margin: "auto",
    width: "85%",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },
  input: {
    margin: 12,
    marginTop: 50,
    width: "80%",
  },
  emptyText: {
    color: "#838383",
    textAlign: "center",
    fontSize: 16,
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
