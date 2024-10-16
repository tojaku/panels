import { onMount } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../../components/AuthProvider";
import { pb } from "../../services/pocketbase";

export default function UserSignOut() {
    const user = useAuth();

    onMount(async () => {
        if (user() === null) return;
        pb.authStore.clear();
    });

    return (
        <div class="hero min-h-[50vh] bg-base-200">
            <div class="hero-content text-center">
                <div class="max-w-xl">
                    <h1 class="text-5xl font-bold">Odjavljeni ste</h1>
                    <p class="py-6">Uspješno ste se odjavili, možete nastaviti na naslovnicu ili se možete ponovno prijaviti.</p>
                    <A class="btn btn-ghost mx-4" href="/user/signin">Prijava</A>
                    <A class="btn btn-primary" href="/">Naslovnica</A>
                </div>
            </div>
        </div>
    );
}