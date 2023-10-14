import Layout from "../components/layout";
import PostList from "../components/postList";

export default function () {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 py-10 m-6 gap-8">
        <PostList />
      </div>
    </Layout>
  );
}
