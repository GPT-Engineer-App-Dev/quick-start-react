import { useState } from 'react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent } from '../integrations/supabase/index.js';
import { Box, Button, FormControl, FormLabel, Input, Table, Tbody, Td, Th, Thead, Tr, VStack, useToast } from '@chakra-ui/react';

const Events = () => {
  const { data: events, isLoading, isError } = useEvents();
  const addEvent = useAddEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const toast = useToast();

  const [form, setForm] = useState({ name: '', date: '', venue: '' });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateEvent.mutate({ ...form, id: editingId }, {
        onSuccess: () => {
          toast({ title: 'Event updated.', status: 'success', duration: 2000, isClosable: true });
          setEditingId(null);
          setForm({ name: '', date: '', venue: '' });
        },
        onError: () => {
          toast({ title: 'Error updating event.', status: 'error', duration: 2000, isClosable: true });
        }
      });
    } else {
      addEvent.mutate(form, {
        onSuccess: () => {
          toast({ title: 'Event added.', status: 'success', duration: 2000, isClosable: true });
          setForm({ name: '', date: '', venue: '' });
        },
        onError: () => {
          toast({ title: 'Error adding event.', status: 'error', duration: 2000, isClosable: true });
        }
      });
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setForm({ name: event.name, date: event.date, venue: event.venue });
  };

  const handleDelete = (id) => {
    deleteEvent.mutate(id, {
      onSuccess: () => {
        toast({ title: 'Event deleted.', status: 'success', duration: 2000, isClosable: true });
      },
      onError: () => {
        toast({ title: 'Error deleting event.', status: 'error', duration: 2000, isClosable: true });
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading events.</div>;

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={form.name} onChange={handleChange} />
          </FormControl>
          <FormControl id="date" isRequired>
            <FormLabel>Date</FormLabel>
            <Input type="date" name="date" value={form.date} onChange={handleChange} />
          </FormControl>
          <FormControl id="venue" isRequired>
            <FormLabel>Venue</FormLabel>
            <Input type="number" name="venue" value={form.venue} onChange={handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="blue">{editingId ? 'Update' : 'Add'} Event</Button>
        </VStack>
      </form>

      <Table variant="simple" mt={8}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Date</Th>
            <Th>Venue</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {events.map(event => (
            <Tr key={event.id}>
              <Td>{event.name}</Td>
              <Td>{event.date}</Td>
              <Td>{event.venue}</Td>
              <Td>
                <Button size="sm" onClick={() => handleEdit(event)}>Edit</Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(event.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Events;