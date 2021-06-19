import { createSelector } from "reselect";
import { Schedule, Session, ScheduleGroup } from "../models/Schedule";
import { AppState } from "./state";

const getSchedule = (state: any) => {
  return state.data.schedule;
};
export const getSpeakers = (state: any) => state.data.speakers;
const getSessions = (state: any) => state.data.sessions;
const getFilteredTracks = (state: any) => state.data.filteredTracks;
const getFavoriteIds = (state: any) => state.data.favorites;
const getSearchText = (state: any) => state.data.searchText;

export const getFilteredSchedule = createSelector(
  getSchedule,
  getFilteredTracks,
  (schedule, filteredTracks) => {
    const groups: ScheduleGroup[] = [];
    schedule.groups.forEach((group: any) => {
      const sessions: Session[] = [];
      group.sessions.forEach((session: any) => {
        session.tracks.forEach((track: any) => {
          if (filteredTracks.indexOf(track) > -1) {
            sessions.push(session);
          }
        });
      });
      if (sessions.length) {
        const groupToAdd: ScheduleGroup = {
          time: group.time,
          sessions,
        };
        groups.push(groupToAdd);
      }
    });

    return {
      date: schedule.date,
      groups,
    } as Schedule;
  }
);

export const getSearchedSchedule = createSelector(
  getFilteredSchedule,
  getSearchText,
  (schedule, searchText) => {
    if (!searchText) {
      return schedule;
    }
    const groups: ScheduleGroup[] = [];
    schedule.groups.forEach((group) => {
      const sessions = group.sessions.filter(
        (s) => s.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      );
      if (sessions.length) {
        const groupToAdd: ScheduleGroup = {
          time: group.time,
          sessions,
        };
        groups.push(groupToAdd);
      }
    });
    return {
      date: schedule.date,
      groups,
    } as Schedule;
  }
);

export const getScheduleList = createSelector(
  getSearchedSchedule,
  (schedule) => schedule
);

export const getGroupedFavorites = createSelector(
  getScheduleList,
  getFavoriteIds,
  (schedule, favoriteIds) => {
    const groups: ScheduleGroup[] = [];
    schedule.groups.forEach((group) => {
      const sessions = group.sessions.filter(
        (s) => favoriteIds.indexOf(s.id) > -1
      );
      if (sessions.length) {
        const groupToAdd: ScheduleGroup = {
          time: group.time,
          sessions,
        };
        groups.push(groupToAdd);
      }
    });
    return {
      date: schedule.date,
      groups,
    } as Schedule;
  }
);

const getIdParam = (_state: any, props: any) => {
  return props.match.params["id"];
};

export const getSession = createSelector(
  getSessions,
  getIdParam,
  (sessions, id) => {
    return sessions.find((s) => s.id === id);
  }
);

export const getSpeaker = createSelector(
  getSpeakers,
  getIdParam,
  (speakers, id) => speakers.find((x) => x.id === id)
);

export const getSpeakerSessions = createSelector(getSessions, (sessions) => {
  const speakerSessions: { [key: string]: Session[] } = {};

  sessions.forEach((session) => {
    session.speakerNames &&
      session.speakerNames.forEach((name) => {
        if (speakerSessions[name]) {
          speakerSessions[name].push(session);
        } else {
          speakerSessions[name] = [session];
        }
      });
  });
  return speakerSessions;
});

export const mapCenter = (state: any) => {
  const item = state.data.locations.find(
    (l) => l.id === state.data.mapCenterId
  );
  if (item == null) {
    return {
      id: 1,
      name: "Map Center",
      lat: 43.071584,
      lng: -89.38012,
    };
  }
  return item;
};
