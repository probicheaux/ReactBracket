import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View as BackgroundView, ViewProps } from "../components/Themed";
import Colors from "../constants/Colors";
import Svg, { Path, Polyline, Line, Circle } from "react-native-svg";

import { RootStackScreenProps } from "../types";
import {
  Bracket,
  RoundProps,
  Seed,
  SeedItem,
  SeedTeam,
  RenderSeedProps,
  SingleLineSeed,
} from "react-brackets";

import { tournamentPath, postRequest } from "../constants/Api";

class DefaultDict {
  constructor(defaultVal) {
    return new Proxy(
      {},
      {
        get: (target, name) => (name in target ? target[name] : defaultVal),
      }
    );
  }
}

function View(props: ViewProps) {
  return (
    <BackgroundView darkColor={Colors["dark"]["touchableColor"]} {...props} />
  );
}
type TourneyProps = { winners: RoundProps[]; losers: RoundProps[] };
function BracketLine() {
  return (
    <Svg style={{ width: 30, height: 30, backgroundColor: "transparent" }}>
      <Line x1="0" y1="50%" x2="100" y2="50%" stroke="red" strokeWidth="1" />
    </Svg>
  );
}
function Junction({ isLineConnector }: { isLineConnector: boolean }) {
  if (!isLineConnector) {
    return <BracketLine />;
  }
  let total = 100 + 2 * VerticalMargin;
  let start = 0; //100 * (25 / total);
  let end = 100; //(100 * (total - 25)) / total;
  return (
    <Svg style={{ width: 30, height: 120, backgroundColor: "transparent" }}>
      <Line
        x1="0"
        y1={start.toString() + "%"}
        x2="0"
        y2={end.toString() + "%"}
        stroke="red"
        strokeWidth="2"
      />
      <Line x1="0" y1="50%" x2="100" y2="50%" stroke="red" strokeWidth="1" />
    </Svg>
  );
}

const VerticalMargin = 5;
const CustomSeed = ({
  seed,
  breakpoint,
  roundIndex,
  seedIndex,
  tourney,
  positionInfo,
  setPositionInfo,
}: {
  seed: RenderSeedProps["seed"];
  breakpoint: RenderSeedProps["breakpoint"];
  roundIndex: RenderSeedProps["roundIndex"];
  seedIndex: RenderSeedProps["seedIndex"];
  tourney: TourneyProps;
  positionInfo: any;
  setPositionInfo: Function;
}) => {
  // ------ assuming rounds is the losers brackets rounds ------
  // losers rounds usually got some identical seeds amount like (2 - 2 - 1 - 1)

  // mobileBreakpoint is required to be passed down to a seed
  const bracket = seed.losers ? "losers" : "winners";
  let rounds = tourney[bracket];

  const isLineConnector: boolean =
    rounds[roundIndex].seeds.length === rounds[roundIndex + 1]?.seeds.length;

  //const Wrapper = isLineConnector ? SingleLineSeed : Seed;
  var [x, y, width, height] = positionInfo[bracket][roundIndex];

  function LineComp() {
    if (roundIndex === 0) {
      return <View />;
    } else {
      return <Junction isLineConnector={isLineConnector} />;
    }
  }
  function EndComp() {
    if (roundIndex === rounds.length - 1) {
      return <View />;
    } else {
      return <BracketLine />;
    }
  }
  return (
    <BackgroundView style={{ flexDirection: "row", alignItems: "center" }}>
      <LineComp />
      <BackgroundView
        style={styles.seed}
        onLayout={(event) => {
          let { x, y, width, height } = event.nativeEvent.layout;
          positionInfo[bracket][roundIndex] = [x, y, width, height];
          setPositionInfo(positionInfo);
          console.log("POSITION INFO");
          console.log(JSON.stringify(positionInfo));
        }}
      >
        <View style={styles.seedItem}>
          <View>
            <View style={styles.seedTeam}>
              <Text style={styles.seedText}>
                {seed.teams[0]?.name || "NO TEAM "}
              </Text>
              <Text style={styles.scoreText}>{seed.teams[0]?.game}</Text>
            </View>
            <View
              style={styles.separator}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />
            <View style={styles.seedTeam}>
              <Text style={styles.seedText}>
                {seed.teams[1]?.name || "NO TEAM "}
              </Text>
              <Text style={styles.scoreText}>{seed.teams[1]?.game}</Text>
            </View>
          </View>
        </View>
      </BackgroundView>
      <EndComp />
    </BackgroundView>
  );
};

export default function TournamentScreen({
  route,
  navigation,
}: RootStackScreenProps<"Tournament">) {
  const { name } = route.params;
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  // TypeScript fuckery
  const emptyTourney: TourneyProps = {
    winners: [] as RoundProps[],
    losers: [] as RoundProps[],
  };
  const [tourney, setTourney] = useState(emptyTourney);

  useEffect(() => {
    postRequest({
      path: tournamentPath,
      body: body,
      callback: (json: { rounds: TourneyProps }) => {
        setTourney(json.rounds);
      },
    });
  }, []);

  let body = JSON.stringify({
    tourney_id: 69420,
  });

  const [positionInfo, setPositionInfo] = useState({
    winners: new DefaultDict([0, 0, 0, 0]),
    losers: new DefaultDict([0, 0, 0, 0]),
  });
  function seedRenderer({
    seed,
    breakpoint,
    roundIndex,
    seedIndex,
  }: {
    seed: RenderSeedProps["seed"];
    breakpoint: RenderSeedProps["breakpoint"];
    roundIndex: RenderSeedProps["roundIndex"];
    seedIndex: RenderSeedProps["seedIndex"];
  }) {
    return CustomSeed({
      seed,
      breakpoint,
      roundIndex,
      seedIndex,
      tourney: tourney,
      positionInfo: positionInfo,
      setPositionInfo: setPositionInfo,
    });
  }
  return (
    <BackgroundView style={styles.container}>
      <BackgroundView style={styles.container}>
        <Bracket
          rounds={tourney.winners}
          roundTitleComponent={(title: React.ReactNode, roundIndex: number) => {
            return (
              <BackgroundView style={{ margin: "2px", alignItems: "center" }}>
                <Text style={styles.title}>{title}</Text>
              </BackgroundView>
            );
          }}
          renderSeedComponent={seedRenderer}
        />
        <Bracket
          rounds={tourney.losers}
          roundTitleComponent={(title: React.ReactNode, roundIndex: number) => {
            return (
              <BackgroundView style={{ margin: "2px", alignItems: "center" }}>
                <Text style={styles.title}>{title}</Text>
              </BackgroundView>
            );
          }}
          renderSeedComponent={seedRenderer}
        />
      </BackgroundView>
    </BackgroundView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  seedItem: {
    width: "100%",
    padding: 2,
    textAlign: "center",
    position: "relative",
    flexDirection: "column",
    margin: "5%",
  },
  seedTeam: {
    padding: "1.5rem 1.5rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: "10px",
    marginVertical: "5%",
  },
  seed: {
    padding: "1em 1.5em",
    minWidth: 225,
    width: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    fontSize: 14,
  },
  separator: {
    marginVertical: 3,
    height: 1,
    width: "100%",
  },
  scoreText: {
    backgroundColor: "#702",
    padding: 2,
    textAlign: "center",
    width: "1.5em",
    height: "1.5em",
    alignItems: "center",
    justifyContent: "center",
  },
  seedText: {
    padding: 2,
    textAlign: "center",
    height: "1.5em",
    alignItems: "center",
    justifyContent: "center",
  },
});
