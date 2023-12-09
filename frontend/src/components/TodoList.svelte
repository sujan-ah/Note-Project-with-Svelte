<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    let notes = writable([]);

    onMount(async () => {
		const response = await fetch('http://localhost:5000/api/notes');
		const data = await response.json();
		console.log(data);
		notes.set(data);
	});

	let newNote = '';

	async function addNote() {
		if (newNote.trim() !== '') {
			const response = await fetch('http://localhost:5000/api/notes', {
			    method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    text: newNote,
                    sujan: "ache",
                    done: false, 
                }),
			
			});

			const data = await response.json();
			notes.update(existingNotes => [...existingNotes, data]);
			newNote = '';
		}
	}

	async function removeNote(id) {
		await fetch(`http://localhost:5000/api/notes/${id}`, {
		method: 'DELETE',
		});

    	notes.update(existingNotes => existingNotes.filter(note => note._id !== id));
  	}

  	let done = false
  
  	async function update(id, text) {
    	const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
      	method: 'PUT',
      	headers: {
        'Content-Type': 'application/json',
      	},
      	body: JSON.stringify({ text }),
    });

    const data = await response.json();
	if(data.done === true){
		done = data 
	}
    // Update the task in the local state
    // notes = notes.map(note => (note._id === update._id ? update : note));
  	}
</script>

<main>
    <div class="centered">
		<h2>Write Your Notes</h2>
		<label>
			<input bind:value={newNote} placeholder="what needs to be done?" />
			<button on:click={addNote}>Add</button>
		</label>

		<ul>
            {#each $notes as { _id, text }}
                <li key={_id}>
					<div>
						<input type="checkbox" on:click={update(_id)}/>
						<span>{text}</span>
					</div>
                    
                    <button on:click={() => removeNote(_id)}>Remove</button>
                </li>
            {/each}
        </ul>
	</div>
</main>

<style>
	.centered {
		max-width: 25em;
		margin: 0 auto;
		box-shadow: 0cap;
	}
	.centered h2{
		margin-left: 50px;
		color: rgb(45, 108, 45);
	}
	.centered ul li{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-left: -40px;
	}
	.centered ul li span{
		font-weight: 800;
		margin-left: 5px;
	}

	label {
		width: 100%;
	}
	label input{
		padding: 25px 100px 25px 25px;
		border-radius: 5px;
	}
	
	input {
		flex: 1;
		font-weight: 800;
	}

	span {
		flex: 1;
	}

	button {
		border: none;
		background: url(./remove.svg) no-repeat 50% 50%;
		background-size: 1rem 1rem;
		cursor: pointer;
		height: 100%;
		aspect-ratio: 1;
		opacity: 0.5;
		transition: opacity 0.2s;
	}

	button:hover {
		opacity: 1;
	}
</style>