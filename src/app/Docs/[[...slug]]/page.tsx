
export default function Docs({
  params,
}: {
  params: {
  slug: string[];
};
}) {
  if(params.slug?.length === 2) {
  return <h1>Helloo Docs are :{params.slug?.length}</h1>;
}else {
    return <h1>Helloo Docs :{params.slug?.length}</h1>;
}
}
