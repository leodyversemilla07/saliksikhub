import { useForm } from '@inertiajs/react';
import React, { ChangeEvent } from 'react';

// Define types for the review props
interface Review {
    id: number;
    manuscript: {
        title: string;
    };
    rating?: number;
    comments?: string;
    suggested_edits?: string;
    confidential_comments?: string;
    status: 'pending' | 'approved' | 'rejected';
}

// Define the props passed to the component
interface SubmitReviewProps {
    review: Review;
}

const SubmitReview: React.FC<SubmitReviewProps> = ({ review }) => {
    // Initialize the form data using Inertia's useForm hook
    const { data, setData, post, processing, errors } = useForm({
        rating: review.rating || '',
        comments: review.comments || '',
        suggested_edits: review.suggested_edits || '',
        confidential_comments: review.confidential_comments || '',
        status: review.status || 'pending',
    });

    // Handle input changes for the form
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('reviews.submit', review.id)); // Post the data to the backend
    };

    return (
        <div className="container">
            <h1>Submit Your Review for Manuscript: {review.manuscript.title}</h1>

            <form onSubmit={handleSubmit} className="review-form">
                <div className="form-group">
                    <label htmlFor="rating">Rating (1 to 5):</label>
                    <input
                        type="number"
                        id="rating"
                        name="rating"
                        min="1"
                        max="5"
                        value={data.rating}
                        onChange={handleChange}
                        className="form-control"
                    />
                    {errors.rating && <div className="text-danger">{errors.rating}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="comments">Comments:</label>
                    <textarea
                        id="comments"
                        name="comments"
                        value={data.comments}
                        onChange={handleChange}
                        className="form-control"
                    />
                    {errors.comments && <div className="text-danger">{errors.comments}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="suggested_edits">Suggested Edits:</label>
                    <textarea
                        id="suggested_edits"
                        name="suggested_edits"
                        value={data.suggested_edits}
                        onChange={handleChange}
                        className="form-control"
                    />
                    {errors.suggested_edits && <div className="text-danger">{errors.suggested_edits}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="confidential_comments">Confidential Comments (For Editors Only):</label>
                    <textarea
                        id="confidential_comments"
                        name="confidential_comments"
                        value={data.confidential_comments}
                        onChange={handleChange}
                        className="form-control"
                    />
                    {errors.confidential_comments && <div className="text-danger">{errors.confidential_comments}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        name="status"
                        value={data.status}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    {errors.status && <div className="text-danger">{errors.status}</div>}
                </div>

                <button type="submit" className="btn btn-primary" disabled={processing}>
                    Submit Review
                </button>
            </form>
        </div>
    );
};

export default SubmitReview;
