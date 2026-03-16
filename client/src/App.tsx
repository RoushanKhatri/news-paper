import { Box, CircularProgress, Link, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface NewsItem {
  author?: string;
  title: string;
  description?: string;
  url: string;
  source?: string;
  published_at?: string;
  country?: string;
}

const App = () => {
  const [articles, setArticles] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const api_key = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(`http://api.mediastack.com/v1/news?access_key=${api_key}`)
        const data = res.data?.data
        if (Array.isArray(data)) {
          setArticles(data)
          toast.success('News fetched successfully')
        } else {
          setError('Unexpected API response format')
          toast.error('Failed to fetch news')
        }
      } catch (err) {
        setError('Could not fetch news error: ' + err)
        toast.error('Failed to fetch news')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [api_key])

  return (
    <Box sx={{ p: 2, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        News Feed
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && articles.length === 0 && (
        <Typography variant="body1">No articles yet.</Typography>
      )}

      {articles.map((article, idx) => (
        <Paper key={`${article.url}-${idx}`} variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" component="div">
            <Link href={article.url} target="_blank" rel="noreferrer" underline="hover">
              {article.title}
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {article.source || 'Unknown source'} • {article.published_at ? new Date(article.published_at).toLocaleString() : 'Unknown time'}
          </Typography>
          {article.description && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              {article.description}
            </Typography>
          )}
          {article.author && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              by {article.author}
            </Typography>
          )}
          {article.country && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              country: {article.country}
            </Typography>
          )}

        </Paper>
      ))}
    </Box>
  )
}

export default App