const pexelsBase = 'https://images.pexels.com/photos';

function pexelsPhoto(id: string, width: number, height: number) {
  return `${pexelsBase}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${width}&h=${height}`;
}

export const externalImages = {
  marketingWorkshopPortrait: pexelsPhoto('17713876', 1200, 1500),
  teamPresentationWide: pexelsPhoto('29253465', 1400, 900),
  digitalPresentationWide: pexelsPhoto('34221175', 1400, 900),
  strategyDiscussionWide: pexelsPhoto('36733326', 1400, 800),
  plantOfficePresentation: pexelsPhoto('34774341', 1400, 900),
  collaborationWorkspace: pexelsPhoto('4339729', 1200, 800),
  meetingPresentationPortrait: pexelsPhoto('6340631', 1000, 1300),
  marketingLaptopPortrait: pexelsPhoto('6476252', 1000, 1300),
  teamPresentation16x9: pexelsPhoto('8463145', 1400, 788),
  planningSessionWide: pexelsPhoto('7792868', 1400, 933),
  onlineMarketingMeeting: pexelsPhoto('7970850', 1000, 1300),
  digitalInterfaceMeeting: pexelsPhoto('7988219', 1400, 933),
};