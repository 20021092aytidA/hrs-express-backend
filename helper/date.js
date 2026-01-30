const getDateTime = () => {
  const date = new Date();
  const todayDate = date.toISOString().slice(0, 10);
  const time = date.toTimeString().split(" ")[0];
  const dateTime = `${todayDate} ${time}`;

  return dateTime;
};

module.exports = { getDateTime };
