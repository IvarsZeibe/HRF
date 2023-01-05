import { Link } from "react-router-dom";

const Test = ({ path, content, name, img }) => (
  <Link to={path} className="flex justify-between flex-col px-10 py-12 rounded-[20px]  w-64 md:mr-10 sm:mr-5 mr-0 my-5 test-card">
    <img src={img} alt={name} className="mx-auto w-[72px] h-[72px]" />
    <div>
      <p className="my-8" style={{ textAlign: "center" }}>
        {content}
      </p>
      <h4 className="font-poppins font-semibold text-[20px] leading-[32px] text-white" style={{ textAlign: "center" }}>
        {name}
      </h4>
      <p className="my-8" style={{ textAlign: "center" }}>
        {content}
      </p>
    </div>
  </Link>
);

export default Test;
