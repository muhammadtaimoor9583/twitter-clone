import { useMutation, useQueryClient } from '@tanstack/react-query';
import react from 'react';
import toast from 'react-hot-toast';

const useFollow=()=>{
    const queryClient=useQueryClient();

    const {mutate:follow,isPending}=useMutation({
        mutationKey:['follow'],
        mutationFn:async(userId)=>{
            try {
                const res=await fetch(`http://localhost:5000/api/user/follow/${userId}`,{
                    method:'POST',
                    credentials:'include'
                });
                const data=await res.json();
                if(!res.ok){
                    throw new Error(data.error || 'Something went wrong');
                }
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess:()=>{
            toast.success('Followed Successfully')
            Promise.all([
                queryClient.invalidateQueries(['suggestedUser']),
                queryClient.invalidateQueries(['authUser'])
            ])
        }
    });
    return {follow,isPending}
}

export default useFollow;