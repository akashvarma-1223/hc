import { Calendar, Users, User } from "lucide-react";
import { motion } from "framer-motion";


// interface SkillCardProps {
//   post: SkillPost;
//   index: number;
// }

const SkillCard = ({ post, index }) => {
  return (
    <motion.div
      className="skill-card p-6 mb-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex flex-wrap items-start gap-2 mb-2">
        <span className={`badge ${post.type === 'offering' ? 'badge-offering' : 'badge-seeking'} uppercase text-xs tracking-wider`}>
          {post.type === 'offering' ? 'OFFERING' : 'SEEKING'}
        </span>
        <span className="text-sm text-gray-500 font-medium">{post.category}</span>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
      
      <p className="text-gray-600 mb-5">{post.description}</p>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <Calendar size={16} className="text-gray-400" />
          <span>{post.availability}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Users size={16} className="text-gray-400" />
          <span>{post.participants} participant{post.participants !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="flex items-center gap-1.5 ml-auto">
          <User size={16} className="text-gray-400" />
          <span>Posted by: {post.user_name ? post.user_name : post.postedBy}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillCard;
