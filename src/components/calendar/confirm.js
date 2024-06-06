const Confirm = ({ formData, date, time }) => {
    console.log("confirm", time);
    const options1 = { year: '4-digit', month: '2-digit', day: '2-digit' };

  return (
    <div>
      <h1>Confirm</h1>
      Creating the following events
      {time?.time?.map((t, index) => (
        <div key={index}>
          <h2>
            {date.toLocaleString()} {t.time}
          </h2>
          <p>{formData.name}</p>
          <p>{formData.description}</p>
          <p>{formData.location}</p>
          <p>{formData.duration}</p>
        </div>
      ))}
    </div>
  );
};

export default Confirm;
