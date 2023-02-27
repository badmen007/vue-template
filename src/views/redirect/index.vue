<script lang="ts">
export default {
  name: "Redirect",
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { query, params } = route
    router.replace({
      path: "/" + params.path,
      query
    })
    return () => {
      return h("template")
    }
  }
}
</script>
