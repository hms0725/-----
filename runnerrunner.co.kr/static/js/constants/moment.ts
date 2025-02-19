import {Moment} from "moment";
import moment from "moment/moment";

export const FMT_DATETIME = 'YYYY-MM-DD HH:mm:ss';

export const parseDatetime = (datetime: string): Moment => {
  return moment.utc(datetime, FMT_DATETIME);
}

export const parseLocalDateTime = (utcDatetime: string): Moment => {
  return moment.utc(utcDatetime, FMT_DATETIME).local();
}

export const formatYMD = (input: string | null): string => {
  if (!input) {
    return ''
  }

  return moment(input).format('YYYY.MM.DD');
}