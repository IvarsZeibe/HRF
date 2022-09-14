using api.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.controllers;

[Route("api/[controller]")]
[ApiController]
public class TestItemsController : ControllerBase
{
    private readonly Context _context;

    public TestItemsController(Context context)
    {
        _context = context;
        _context.Database.EnsureCreated();
    }

    // GET: api/TestItems
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TestItem>>> GetTestItems()
    {
        _context.Database.EnsureCreated();
        if (_context.TestItems == null)
        {
            return NotFound();
        }
        return await _context.TestItems.ToListAsync();
    }

    // GET: api/TestItems/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TestItem>> GetTestItem(long id)
    {
        if (_context.TestItems == null)
        {
            return NotFound();
        }
        var testItem = await _context.TestItems.FindAsync(id);

        if (testItem == null)
        {
            return NotFound();
        }

        return testItem;
    }

    // PUT: api/TestItems/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTestItem(long id, TestItem testItem)
    {
        if (id != testItem.Id)
        {
            return BadRequest();
        }

        _context.Entry(testItem).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TestItemExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/TestItems
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<TestItem>> PostTestItem(TestItem testItem)
    {
        if (_context.TestItems == null)
        {
            return Problem("Entity set 'TestContext.TestItems'  is null.");
        }
        _context.TestItems.Add(testItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTestItem), new { id = testItem.Id }, testItem);
    }

    // DELETE: api/TestItems/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTestItem(long id)
    {
        if (_context.TestItems == null)
        {
            return NotFound();
        }
        var testItem = await _context.TestItems.FindAsync(id);
        if (testItem == null)
        {
            return NotFound();
        }

        _context.TestItems.Remove(testItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TestItemExists(long id)
    {
        return (_context.TestItems?.Any(e => e.Id == id)).GetValueOrDefault();
    }
}
