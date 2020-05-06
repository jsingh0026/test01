import React from 'react';
import styled from 'styled-components';
// import Mic from '../icons/microphone.svg';
import MicIcon from 'material-icons-svg/components/baseline/Mic';

interface Props {
  buckets: number;
  volume: number;
  speaking: boolean;
}

interface ContainerProps {
  buckets: number;
}

const Container = styled.div(({ buckets }: ContainerProps) => ({
  // width: '25px',
  display: 'grid',
  // gridTemplateRows: `repeat(${buckets}, 1fr)`,
  // gridRowGap: '2px'
}));

interface BucketProps {
  filled: boolean;
  speaking: boolean;
}

const Bucket = styled.div(({ filled, speaking }: BucketProps) => ({
  border: '1px solid white',
  borderRadius: '4px',
  // backgroundColor: filled ? (speaking ? '#4284f3' : 'white') : ''
}));
const Bar = styled.div({
  backgroundColor: '#4284f3',
  position: 'absolute',
  bottom: '9px',
  width: '14px',
  borderRadius: '20px',
  minHeight: '6%',
  maxHeight: '94%',
});

const VolumeMeter: React.SFC<Props> = ({ buckets, volume, speaking }) => {
  const bucketSize = 100 / buckets;
  return (
    <Container buckets={buckets}>
      {/* {Array.from(Array(buckets)).map((_, i) => ( */}
        <Bucket
          filled={volume >= (buckets - 10) * bucketSize}
          speaking={speaking}
        >
          <Bar style={{height:volume+`%`}}/>
          <MicIcon /></Bucket>
      {/* ))} */}
    </Container>
  );
};

export default VolumeMeter;
