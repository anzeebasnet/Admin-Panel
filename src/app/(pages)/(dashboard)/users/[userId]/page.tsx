

const Page = ({ params }: { params: { userId: string[] } }) => {
  return(
    <div>This is the detail of user {params.userId}</div>
  )
};



export default Page;
