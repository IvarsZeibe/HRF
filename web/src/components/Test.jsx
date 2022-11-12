const Test = ({ content, name, img }) => (
  <div className="flex justify-between flex-col px-10 py-12 rounded-[20px]  max-w-[370px] md:mr-10 sm:mr-5 mr-0 my-5 test-card">

    <p className="my-8">
      {content}
    </p>

    <div className="flex flex-row">
      <img src={img} alt={name} className="w-[72px] h-[72px]" />
      <div className="flex flex-col ml-4">
        <h4 className="font-poppins font-semibold text-[20px] leading-[32px] text-white">
          {name}
        </h4>
      </div>
    </div>

    <p className="my-8">
      {content}
    </p>
  </div>
);


export default Test;
