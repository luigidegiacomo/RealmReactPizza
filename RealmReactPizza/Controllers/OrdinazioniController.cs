using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PizzApp.Models;
using PizzApp.Services;

namespace RealmReactPizza.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrdinazioniController : ControllerBase
    {

        private readonly ILogger<OrdinazioniController> _logger;

        public OrdinazioniController(ILogger<OrdinazioniController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<IEnumerable<RigaOrdine>> Get()
        {
            string partition = "02";
            var listaOrdinazioni = await RealmDataStore.ListaOrdiniDaEvadere(partition);
            return listaOrdinazioni;
        }
    }
}
