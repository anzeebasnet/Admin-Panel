import moment from "moment";
export const calculateServiceTime = (services: any, startTime: any) => {
  let currentTime = moment(startTime, "HH:mm:ss");
  return services?.map((service: any, index: any) => {
    const duration = moment.duration(service.duration);
    const serviceStartTime = currentTime.format("HH:mm:ss"); // 24-hour format
    currentTime.add(duration);
    const serviceEndTime = currentTime.format("HH:mm:ss"); // 24-hour format
    if (index > 0) {
      const previousService = services[index - 1];
      const previousDuration = moment.duration(previousService.duration);
      currentTime = moment(currentTime).add(previousDuration);
    }
    return {
      startTime: serviceStartTime,
      endTime: serviceEndTime,
    };
  });
};
