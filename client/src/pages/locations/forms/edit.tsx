import { useParams } from 'react-router-dom';
import LocationForm from './LocationForm';

export default function EditLocationPage() {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return <div>Error: Location ID not specified</div>;
    }

    return <LocationForm mode="edit" locationId={id} />;
}