import { motion } from "framer-motion";
// import { FoodPost } from "../lib/data";

// interface FoodCardProps {
//   post: FoodPost;
//   index: number;
// }

const FoodCard = ({ post, index }) => {
  return (
    <motion.div
      className="p-6 mb-5 bg-white rounded-lg border border-gray-100 shadow-sm max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="text-xl font-semibold mb-1">{post.title}</h3>
          <p className="text-sm text-gray-600">{post.postedBy} (Room-{post.location})</p>
        </div>
        
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
          post.post_type === 'Offering Food' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {post.post_type === 'Offering Food' ? 'Offering' : 'Requesting'}
        </span>
      </div>
      
      <p className="text-gray-600 mb-3">{post.description}</p>
      
      {post.price && (
        <div className="text-sm font-medium text-gray-700">
          {post.price}
        </div>
      )}
    </motion.div>
  );
};

export default FoodCard;