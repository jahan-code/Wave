import { setFollowers, setFollowing } from "@/redux/authSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const useFollowUnfollow = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);

    const toggleFollowUnfollow = async (jiskofollowkrunga) => {
        try {
            const res = await axios.post(
                `https://wave-production-a567.up.railway.app/api/v1/user/followorunfollow/${jiskofollowkrunga}`,
                {},
                { withCredentials: true }
            );

            if (res.data.success) {
                // Check if the action was to follow or unfollow
                const isFollowing = user.following.includes(jiskofollowkrunga);

                if (isFollowing) {
                    // Unfollow case: Remove targetUserId from following
                    const updatedFollowing = user.following.filter(id => id !== jiskofollowkrunga);
                    dispatch(setFollowing(updatedFollowing));
                } else {
                    // Follow case: Add targetUserId to following
                    const updatedFollowing = [...user.following, jiskofollowkrunga];
                    dispatch(setFollowing(updatedFollowing));
                }

                // Update followers for the targeted user
                const updatedFollowers = isFollowing
                    ? user.followers.filter(id => id !== user._id)
                    : [...user.followers, user._id];

                dispatch(setFollowers(updatedFollowers));
            } else {
                console.error(res.data.message);
            }
        } catch (error) {
            console.error("Error in follow/unfollow functionality:", error);
        }
    };

    return { toggleFollowUnfollow };
};

export default useFollowUnfollow;
