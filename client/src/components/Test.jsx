import styled from "styled-components";

const StyledTest = styled.div`
  box-sizing: border-box;
`;

export default function Test({ title }) {
  return (
    <StyledTest className="bg-yellow-500">
      <h1 className="w-60 h-64 bg-lime-400 font-bold italic ffont-stretch-extra-expanded">
        {title}
      </h1>
    </StyledTest>
  );
}
