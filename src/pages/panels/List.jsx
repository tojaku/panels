import { onMount, createSignal, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { isAuthorized } from "../../components/AuthBoundary.jsx";
import { getItems } from "../../services/directus.js";

export default function PanelsList() {
    const adminUrl = import.meta.env.VITE_DIRECTUS_URL;

    const navigate = useNavigate();

    const [items, setItems] = createSignal([]);
    const [error, setError] = createSignal(false);

    onMount(async () => {
        if (!isAuthorized()) return;

        try {
            const result = await getItems("panels", {
                filter: {
                    "user_created": {
                        "_eq": "$CURRENT_USER"
                    }
                }
            });
            setItems(result);
            import.meta.env.DEV && console.log("[onMount] Items fetched", result.length);
        } catch (error) {
            setError(true);
            import.meta.env.DEV && console.error(error);
        }
    });

    return (
        <>
            <div class="prose mb-8">
                <h1>Pregled ploča</h1>
            </div>
            <div class="flex flex-wrap gap-4 justify-start items-start">
                <div class="flex-initial">
                    <For each={items()}>{(item, i) =>
                        <div style={`background-color: ${item.background_color}; color: ${item.font_color}`} class="w-64 min-h-[12vh] shadow-md rounded-md">
                            <div class="flex p-4 gap-1">
                                <h2 class="flex-1 text-lg font-bold"><A href={`/panels/${item.id}`} target="_blank">{item.title}</A></h2>
                                <div class="flex-initial">
                                    <A href={`${adminUrl}/admin/content/panels/${item.id}`} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" height="1.25em" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" /></svg></A>
                                </div>
                            </div>
                        </div>
                    }</For>
                </div>
            </div>

            <Show when={error() === true}>
                <div role="alert" class="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Dogodila se greška prilikom učitavanja ploča. Ukoliko se problem ponovi, kontaktirajte administratora.</span>
                </div>
            </Show>
        </>
    );
}