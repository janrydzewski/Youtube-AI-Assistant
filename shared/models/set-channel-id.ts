export interface SetChannelIdRequest {
  channelName: string;
}

export interface SetChannelIdResponse {
  message: string;
  channelName: string;
  channelId: string;
}
