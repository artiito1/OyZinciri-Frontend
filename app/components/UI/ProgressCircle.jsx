import React from 'react'

export const ProgressCircle = ({percentage, lable, count = 0}) => {
  return (
    <div className='relative w-full h-full'>
            <svg className="w-full h-full"  viewBox="0 0 100 100">
                <circle
                    className='stroke-gray-400/20 relative z-10'
                    cx= "50"
                    cy= "50"
                    r= "40"
                    fill= "none"
                    strokeWidth="14"
                    transform='rotate(-270 50 50)'
                    strokeDasharray = {300}
                />
                <circle
                    className='stroke-primary relative z-10'
                    cx= "50"
                    cy= "50"
                    r= "40"
                    fill= "none"
                    strokeWidth="14"
                    transform='rotate(-270 50 50)'
                    strokeDasharray = {`${percentage*2.51} 251`}
                />
                <text x='50' y='50' textAnchor='middle' dy='.3em' className='fill-white text-xl' >
                    {percentage}%
                </text>
            </svg>
            <div className='text-center mt-1'>
                <p className='text-gray-400 text-sm font-bold'>{lable} ({count})</p>
                <svg className="w-7 h-7 text-white mx-auto mt-2" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32.298 0.656012C33.99 -0.273988 36 0.978012 36 2.85201V37.148C36 39.022 33.99 40.274 32.298 39.344C30.024 38.096 23.292 34.46 19.262 32.858C16.7626 31.8519 14.1633 31.1144 11.508 30.658L9.962 38.392C9.91052 38.6497 9.8088 38.8946 9.66264 39.113C9.51648 39.3313 9.32875 39.5187 9.11016 39.6645C8.89157 39.8103 8.64641 39.9116 8.38866 39.9627C8.13092 40.0137 7.86565 40.0135 7.608 39.962C7.35035 39.9105 7.10536 39.8088 6.88701 39.6626C6.66867 39.5165 6.48126 39.3287 6.33547 39.1102C6.18968 38.8916 6.08838 38.6464 6.03734 38.3887C5.9863 38.1309 5.98652 37.8657 6.038 37.608L7.524 30.178C6.98517 30.1375 6.44578 30.1049 5.906 30.08C2.7 29.932 0 27.342 0 24V16C0 12.658 2.7 10.068 5.906 9.92001C6.61533 9.88668 7.31333 9.84134 8 9.78401V28H8.068C8.24354 27.696 8.49602 27.4435 8.80004 27.268C9.10407 27.0925 9.44894 27.0001 9.8 27.0001C10.1511 27.0001 10.4959 27.0925 10.8 27.268C11.104 27.4435 11.3565 27.696 11.532 28H12V9.25601C14.4843 8.79447 16.9163 8.0863 19.26 7.14201C23.292 5.54001 30.024 1.90201 32.298 0.656012Z" fill="#BDC6C5"></path></svg>
            </div>
        </div>
  )
}
